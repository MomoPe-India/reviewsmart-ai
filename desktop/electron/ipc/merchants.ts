import { IpcMain, shell } from 'electron'
import { prisma } from '../prisma'
import * as bcrypt from 'bcryptjs'
import * as https from 'https'
import * as http from 'http'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin.trim(), 10)
}

// Resolve a Google Maps share link to a direct Place ID review URL
async function resolveGoogleMapsUrl(rawUrl: string): Promise<{ placeId?: string; reviewUrl?: string }> {
  if (!rawUrl) return {}

  // Already a direct write-review URL
  if (rawUrl.includes('writereview')) {
    const match = rawUrl.match(/placeid=([A-Za-z0-9_-]+)/)
    return match ? { placeId: match[1], reviewUrl: rawUrl } : { reviewUrl: rawUrl }
  }

  // Extract ChIJ from URL
  const chijMatch = rawUrl.match(/(ChIJ[A-Za-z0-9_-]+)/)
  if (chijMatch) {
    const placeId = chijMatch[1]
    return { placeId, reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}` }
  }

  // Try to follow the share.google redirect to get final URL
  if (rawUrl.includes('share.google') || rawUrl.includes('maps.app.goo')) {
    try {
      const resolved = await followRedirect(rawUrl)
      const chijMatch2 = resolved.match(/(ChIJ[A-Za-z0-9_-]+)/)
      if (chijMatch2) {
        const placeId = chijMatch2[1]
        return { placeId, reviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}` }
      }
    } catch {
      // Fallback: return raw URL
    }
  }

  return { reviewUrl: rawUrl }
}

function followRedirect(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { timeout: 5000 }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location)
      } else {
        resolve(url)
      }
    }).on('error', reject)
  })
}

export function registerMerchantHandlers(ipcMain: IpcMain): void {

  // GET ALL MERCHANTS
  ipcMain.handle('merchants:getAll', async () => {
    try {
      const merchants = await prisma.user.findMany({
        where: { role: 'BUSINESS_OWNER' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, phone: true, userIdTag: true, email: true,
          customerType: true, isActive: true, referredBy: true, createdAt: true,
          businesses: {
            select: {
              id: true, name: true, slug: true, tagline: true, category: true,
              logoUrl: true, primaryColor: true, googleReviewUrl: true,
              googlePlaceId: true, googleAddress: true, phone: true, whatsapp: true,
              instagram: true, facebook: true, website: true, minRatingForGoogle: true,
              tagChips: true, keywords: true, reviewPromptTone: true, qrMode: true,
              packageTier: true, isPaid: true, demoExpiresAt: true, demoUsed: true,
              createdAt: true, updatedAt: true,
            }
          },
          upiPayments: {
            select: { id: true, amount: true, status: true, agentCode: true, commission: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
          }
        }
      })

      const now = new Date()
      return {
        success: true,
        merchants: merchants.map(m => {
          const approved = m.upiPayments.filter(p => p.status === 'APPROVED')
          const totalPaid = approved.reduce((s, p) => s + p.amount, 0)
          return {
            ...m,
            totalPaid,
            dealCount: m.upiPayments.length,
            businesses: m.businesses.map(b => ({
              ...b,
              isDemoActive: !b.isPaid && Boolean(b.demoExpiresAt && new Date(b.demoExpiresAt) > now),
            }))
          }
        })
      }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // GET ONE MERCHANT
  ipcMain.handle('merchants:getOne', async (_, id: string) => {
    try {
      const merchant = await prisma.user.findUnique({
        where: { id },
        include: {
          businesses: true,
          upiPayments: { orderBy: { createdAt: 'desc' } }
        }
      })
      return { success: true, merchant }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // CREATE MERCHANT
  ipcMain.handle('merchants:create', async (_, data: any) => {
    try {
      const { name, phone, businessName, category, googleReviewUrl, tagChips, keywords,
        reviewPromptTone, minRatingForGoogle, tagline, qrMode, packageTier, whatsapp,
        instagram, facebook, website, logoUrl, primaryColor } = data

      if (!name || !phone) return { success: false, error: 'Name and phone are required.' }

      const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10)
      const existing = await prisma.user.findFirst({ where: { OR: [{ phone: cleanPhone }, { userIdTag: cleanPhone }] } })
      if (existing) return { success: false, error: 'A merchant with this phone number already exists.' }

      const pin = generatePin()
      const hashedPin = await hashPin(pin)
      const hashedPassword = await hashPin(pin)
      const bName = (businessName || name).trim()
      let slug = slugify(bName)
      // Ensure slug uniqueness
      const slugExists = await prisma.business.findUnique({ where: { slug } })
      if (slugExists) slug = `${slug}-${cleanPhone.slice(-4)}`

      // Resolve Google Maps URL
      let resolvedPlaceId: string | undefined
      let resolvedReviewUrl: string | undefined
      if (googleReviewUrl) {
        const resolved = await resolveGoogleMapsUrl(googleReviewUrl)
        resolvedPlaceId = resolved.placeId
        resolvedReviewUrl = resolved.reviewUrl
      }

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: `${cleanPhone}@merchant.reviewsmart.local`,
          phone: cleanPhone,
          userIdTag: cleanPhone,
          pinCode: hashedPin,
          password: hashedPassword,
          role: 'BUSINESS_OWNER',
          customerType: data.customerType || 'OFFLINE',
          isActive: true,
          businesses: {
            create: {
              name: bName,
              slug,
              tagline: tagline || 'Review our service & share your experience!',
              category: category || 'Local Business',
              logoUrl: logoUrl || null,
              primaryColor: primaryColor || '#4f46e5',
              googlePlaceId: resolvedPlaceId || null,
              googleReviewUrl: resolvedReviewUrl || googleReviewUrl || null,
              phone: cleanPhone,
              whatsapp: whatsapp || null,
              instagram: instagram || null,
              facebook: facebook || null,
              website: website || null,
              tagChips: tagChips || 'Friendly Staff,Fast Service,Great Quality,Fair Pricing,Clean Ambiance',
              keywords: keywords || 'exceptional service, highly recommended, friendly staff',
              reviewPromptTone: reviewPromptTone || 'friendly',
              minRatingForGoogle: minRatingForGoogle || 4,
              qrMode: qrMode || 'SMART_HUB',
              packageTier: packageTier || 'EXECUTIVE_STANDEE',
              isPaid: false,
            }
          }
        },
        include: { businesses: true }
      })

      return { success: true, merchant: user, pin, message: `Merchant created! Login PIN: ${pin}` }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // UPDATE MERCHANT
  ipcMain.handle('merchants:update', async (_, data: any) => {
    try {
      const { merchantId, businessId, name, phone, businessName, category, googleReviewUrl,
        tagChips, keywords, reviewPromptTone, minRatingForGoogle, tagline, qrMode,
        packageTier, whatsapp, instagram, facebook, website, logoUrl, primaryColor,
        isPaid, customerType } = data

      if (!merchantId) return { success: false, error: 'merchantId is required.' }

      const userUpdate: Record<string, unknown> = {}
      if (name) userUpdate.name = name.trim()
      if (customerType) userUpdate.customerType = customerType

      if (phone) {
        const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10)
        const conflict = await prisma.user.findFirst({
          where: { AND: [{ OR: [{ phone: cleanPhone }, { userIdTag: cleanPhone }] }, { id: { not: merchantId } }] }
        })
        if (conflict) return { success: false, error: 'Another merchant with this phone already exists.' }
        userUpdate.phone = cleanPhone
        userUpdate.userIdTag = cleanPhone
        userUpdate.email = `${cleanPhone}@merchant.reviewsmart.local`
      }

      const bizUpdate: Record<string, unknown> = {}
      if (businessName) bizUpdate.name = businessName.trim()
      if (category) bizUpdate.category = category
      if (tagline) bizUpdate.tagline = tagline
      if (tagChips !== undefined) bizUpdate.tagChips = tagChips
      if (keywords !== undefined) bizUpdate.keywords = keywords
      if (reviewPromptTone) bizUpdate.reviewPromptTone = reviewPromptTone
      if (minRatingForGoogle) bizUpdate.minRatingForGoogle = Number(minRatingForGoogle)
      if (qrMode) bizUpdate.qrMode = qrMode
      if (packageTier) bizUpdate.packageTier = packageTier
      if (whatsapp !== undefined) bizUpdate.whatsapp = whatsapp
      if (instagram !== undefined) bizUpdate.instagram = instagram
      if (facebook !== undefined) bizUpdate.facebook = facebook
      if (website !== undefined) bizUpdate.website = website
      if (logoUrl !== undefined) bizUpdate.logoUrl = logoUrl
      if (primaryColor) bizUpdate.primaryColor = primaryColor
      if (isPaid !== undefined) bizUpdate.isPaid = Boolean(isPaid)

      if (googleReviewUrl !== undefined) {
        if (googleReviewUrl) {
          const resolved = await resolveGoogleMapsUrl(googleReviewUrl)
          if (resolved.placeId) bizUpdate.googlePlaceId = resolved.placeId
          bizUpdate.googleReviewUrl = resolved.reviewUrl || googleReviewUrl
        } else {
          bizUpdate.googleReviewUrl = null
          bizUpdate.googlePlaceId = null
        }
      }

      await prisma.$transaction(async (tx) => {
        if (Object.keys(userUpdate).length > 0) {
          await tx.user.update({ where: { id: merchantId }, data: userUpdate })
        }
        if (Object.keys(bizUpdate).length > 0) {
          const bid = businessId || (await tx.business.findFirst({ where: { userId: merchantId } }))?.id
          if (bid) {
            await tx.business.update({ where: { id: bid }, data: bizUpdate })
          }
        }
      })

      const updated = await prisma.user.findUnique({
        where: { id: merchantId },
        include: { businesses: true, upiPayments: { orderBy: { createdAt: 'desc' }, take: 5 } }
      })
      return { success: true, merchant: updated }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // DELETE MERCHANT
  ipcMain.handle('merchants:delete', async (_, id: string) => {
    try {
      await prisma.$transaction(async (tx) => {
        const businesses = await tx.business.findMany({ where: { userId: id }, select: { id: true } })
        const bizIds = businesses.map(b => b.id)
        if (bizIds.length > 0) {
          await tx.reviewAnalytics.deleteMany({ where: { businessId: { in: bizIds } } })
          await tx.privateFeedback.deleteMany({ where: { businessId: { in: bizIds } } })
          await tx.generatedReviewMemory.deleteMany({ where: { businessId: { in: bizIds } } })
          await tx.business.deleteMany({ where: { userId: id } })
        }
        await tx.userSubscription.deleteMany({ where: { userId: id } })
        await tx.upiPayment.deleteMany({ where: { userId: id } })
        await tx.user.updateMany({ where: { referredBy: id }, data: { referredBy: null } })
        await tx.user.delete({ where: { id } })
      })
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // TOGGLE ACTIVE
  ipcMain.handle('merchants:toggleActive', async (_, id: string) => {
    try {
      const user = await prisma.user.findUnique({ where: { id }, select: { isActive: true, name: true } })
      if (!user) return { success: false, error: 'Merchant not found.' }
      const updated = await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } })
      return { success: true, isActive: updated.isActive, message: `${user.name} is now ${updated.isActive ? 'ACTIVE' : 'SUSPENDED'}.` }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // RESET PIN
  ipcMain.handle('merchants:resetPin', async (_, id: string, customPin?: string) => {
    try {
      const newPin = customPin && /^\d{4}$/.test(customPin) ? customPin : generatePin()
      const hashed = await hashPin(newPin)
      await prisma.user.update({ where: { id }, data: { pinCode: hashed, password: hashed } })
      return { success: true, pin: newPin, message: `PIN reset to ${newPin}` }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // ACTIVATE DEMO
  ipcMain.handle('merchants:activateDemo', async (_, businessId: string) => {
    try {
      const business = await prisma.business.findUnique({ where: { id: businessId } })
      if (!business) return { success: false, error: 'Business not found.' }
      if (business.demoUsed) return { success: false, error: 'Demo has already been used for this business.' }
      const demoExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      await prisma.business.update({
        where: { id: businessId },
        data: { demoExpiresAt, demoActivatedAt: new Date(), demoUsed: true }
      })
      return { success: true, demoExpiresAt, message: '3-day demo activated successfully.' }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // APPROVE PAYMENT (direct — without UPI flow)
  ipcMain.handle('merchants:approvePayment', async (_, businessId: string, amount: number, packageTier: string) => {
    try {
      await prisma.business.update({
        where: { id: businessId },
        data: { isPaid: true, packageTier: packageTier || 'EXECUTIVE_STANDEE' }
      })
      return { success: true, message: 'Business card is now LIVE.' }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // RESOLVE GOOGLE URL
  ipcMain.handle('merchants:resolveGoogleUrl', async (_, url: string) => {
    try {
      const result = await resolveGoogleMapsUrl(url)
      return { success: true, ...result }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // GENERATE AI CHIPS via Gemini
  ipcMain.handle('merchants:generateAiChips', async (_, businessType: string, businessName: string) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) return { success: false, error: 'Gemini API key not configured.' }

      const prompt = `You are a business review expert. Generate exactly 8 short tag chips (2-4 words each) for a ${businessType} business called "${businessName}".
These chips should represent the most relevant aspects customers would highlight in a positive Google review.
Return ONLY a comma-separated list of chips, no explanations, no numbering.
Example format: Friendly Staff,Fast Service,Great Quality,Fair Pricing,Clean Ambiance,Professional Team,Value for Money,Reliable Service`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
        })
      })

      const json = await response.json() as any
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!text) return { success: false, error: 'No response from Gemini.' }

      const chips = text.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0).slice(0, 8)
      return { success: true, chips: chips.join(',') }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  })

  // OPEN IN BROWSER
  ipcMain.handle('shell:openExternal', async (_, url: string) => {
    await shell.openExternal(url)
    return { success: true }
  })
}
