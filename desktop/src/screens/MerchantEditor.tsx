import React, { useState, useEffect } from 'react'
import {
  Save,
  Sparkles,
  MapPin,
  CheckCircle,
  ExternalLink,
  ShieldAlert,
  Palette,
  Phone,
  Store,
  Layers,
  HelpCircle,
} from 'lucide-react'
import { Merchant, Screen } from '@/lib/types'
import { API, getReviewPageUrl } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'

interface MerchantEditorProps {
  merchantId?: string
  initialMerchant?: Merchant
  onNavigate: (screen: Screen) => void
  showToast: (type: 'success' | 'error' | 'info', message: string) => void
}

const CATEGORIES = [
  'Gold Buying & Valuation Services',
  'Salons, Spas & Beauty Parlors',
  'Restaurants, Cafes & Food Joints',
  'Healthcare, Clinics & Hospitals',
  'Jewellery Showrooms & Retail',
  'Automobile Sales & Service',
  'Electronics & Gadget Stores',
  'Fashion, Boutiques & Tailoring',
  'Fitness, Gyms & Yoga Centers',
  'Real Estate & Property Consultants',
  'Education & Coaching Institutes',
  'Hotels & Lodging',
  'Professional & Legal Services',
  'Local Business & Retail',
]

const PACKAGE_TIERS = [
  { value: 'STARTER_PVC', label: 'Starter PVC Smart Card (₹999 - ₹1,499)' },
  { value: 'EXECUTIVE_STANDEE', label: 'Executive NFC Acrylic Standee (₹1,999 - ₹2,999)' },
  { value: 'ALL_IN_ONE_HUB', label: 'All-in-One Multi-Location Hub (₹3,499 - ₹4,999)' },
  { value: 'ENTERPRISE_CUSTOM', label: 'Enterprise Custom Deployment (₹5,000+)' },
]

export function MerchantEditor({
  merchantId,
  initialMerchant,
  onNavigate,
  showToast,
}: MerchantEditorProps) {
  const isEditing = Boolean(merchantId)

  // Loading state
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resolvingUrl, setResolvingUrl] = useState(false)
  const [generatingChips, setGeneratingChips] = useState(false)

  // Success Modal with PIN for new merchants
  const [newMerchantResult, setNewMerchantResult] = useState<{ pin: string; name: string } | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [tagline, setTagline] = useState('Review our service & share your experience!')
  const [customerType, setCustomerType] = useState('OFFLINE')
  const [packageTier, setPackageTier] = useState('EXECUTIVE_STANDEE')
  const [qrMode, setQrMode] = useState('SMART_HUB')
  const [isPaid, setIsPaid] = useState(false)

  // Google Maps / Review setup
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')
  const [googleAddress, setGoogleAddress] = useState('')

  // AI Review Booster settings
  const [tagChips, setTagChips] = useState('Friendly Staff,Fast Service,Great Quality,Fair Pricing,Clean Ambiance')
  const [keywords, setKeywords] = useState('exceptional service, highly recommended, prompt attention, transparent process')
  const [reviewPromptTone, setReviewPromptTone] = useState('friendly')
  const [minRatingForGoogle, setMinRatingForGoogle] = useState(4)

  // Contact / Social
  const [whatsapp, setWhatsapp] = useState('')
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')

  // Branding
  const [primaryColor, setPrimaryColor] = useState('#4f46e5')
  const [logoUrl, setLogoUrl] = useState('')

  // Business ID ref if editing
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [businessSlug, setBusinessSlug] = useState<string | null>(null)

  // Load existing merchant data
  useEffect(() => {
    if (initialMerchant) {
      populateFields(initialMerchant)
    } else if (merchantId) {
      loadMerchant(merchantId)
    }
  }, [merchantId, initialMerchant])

  const populateFields = (m: Merchant) => {
    setName(m.name || '')
    setPhone(m.phone || '')
    setCustomerType(m.customerType || 'OFFLINE')

    const biz = m.businesses?.[0]
    if (biz) {
      setBusinessId(biz.id)
      setBusinessSlug(biz.slug)
      setBusinessName(biz.name || '')
      setCategory(biz.category || CATEGORIES[0])
      setTagline(biz.tagline || 'Review our service & share your experience!')
      setPackageTier(biz.packageTier || 'EXECUTIVE_STANDEE')
      setQrMode(biz.qrMode || 'SMART_HUB')
      setIsPaid(Boolean(biz.isPaid))

      setGoogleReviewUrl(biz.googleReviewUrl || '')
      setGooglePlaceId(biz.googlePlaceId || '')
      setGoogleAddress(biz.googleAddress || '')

      setTagChips(biz.tagChips || '')
      setKeywords(biz.keywords || '')
      setReviewPromptTone(biz.reviewPromptTone || 'friendly')
      setMinRatingForGoogle(biz.minRatingForGoogle || 4)

      setWhatsapp(biz.whatsapp || '')
      setWebsite(biz.website || '')
      setInstagram(biz.instagram || '')
      setFacebook(biz.facebook || '')

      setPrimaryColor(biz.primaryColor || '#4f46e5')
      setLogoUrl(biz.logoUrl || '')
    }
  }

  const loadMerchant = async (id: string) => {
    setLoading(true)
    try {
      const res = await API.getMerchant(id)
      if (res.success && res.merchant) {
        populateFields(res.merchant)
      } else {
        showToast('error', res.error || 'Failed to load merchant')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error loading merchant')
    } finally {
      setLoading(false)
    }
  }

  // Auto-resolve Google Maps link
  const handleResolveGoogleUrl = async () => {
    if (!googleReviewUrl) {
      showToast('info', 'Please paste a Google Maps link first')
      return
    }

    setResolvingUrl(true)
    try {
      const res = await API.resolveGoogleUrl(googleReviewUrl)
      if (res.success) {
        if (res.placeId) {
          setGooglePlaceId(res.placeId)
          showToast('success', `Place ID extracted: ${res.placeId}`)
        }
        if (res.reviewUrl) {
          setGoogleReviewUrl(res.reviewUrl)
        }
      } else {
        showToast('error', res.error || 'Could not resolve Place ID from URL')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Resolver failed')
    } finally {
      setResolvingUrl(false)
    }
  }

  // Generate AI Chips via Gemini
  const handleGenerateAiChips = async () => {
    const bType = category || 'Local Business'
    const bName = businessName || name || 'Business'

    setGeneratingChips(true)
    try {
      const res = await API.generateAiChips(bType, bName)
      if (res.success && res.chips) {
        setTagChips(res.chips)
        showToast('success', 'Generated 8 customized AI review chips!')
      } else {
        showToast('error', res.error || 'Gemini chip generation failed')
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to call Gemini')
    } finally {
      setGeneratingChips(false)
    }
  }

  // Submit Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !phone.trim()) {
      showToast('error', 'Contact Name and Phone are required')
      return
    }

    setSaving(true)
    try {
      if (isEditing) {
        const payload = {
          merchantId,
          businessId,
          name,
          phone,
          customerType,
          businessName: businessName || name,
          category,
          tagline,
          packageTier,
          qrMode,
          isPaid,
          googleReviewUrl,
          googlePlaceId,
          googleAddress,
          tagChips,
          keywords,
          reviewPromptTone,
          minRatingForGoogle,
          whatsapp,
          website,
          instagram,
          facebook,
          primaryColor,
          logoUrl,
        }

        const res = await API.updateMerchant(payload)
        if (res.success) {
          showToast('success', 'Merchant details saved directly to live database!')
          onNavigate('merchants')
        } else {
          showToast('error', res.error || 'Failed to update merchant')
        }
      } else {
        // Create new
        const payload = {
          name,
          phone,
          customerType,
          businessName: businessName || name,
          category,
          tagline,
          packageTier,
          qrMode,
          googleReviewUrl,
          tagChips,
          keywords,
          reviewPromptTone,
          minRatingForGoogle,
          whatsapp,
          website,
          instagram,
          facebook,
          primaryColor,
          logoUrl,
        }

        const res = await API.createMerchant(payload)
        if (res.success) {
          setNewMerchantResult({
            pin: res.pin,
            name: businessName || name,
          })
          showToast('success', 'New merchant created and saved to live database!')
        } else {
          showToast('error', res.error || 'Failed to create merchant')
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'Save operation failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isEditing ? `Edit: ${businessName || name}` : 'Add New Merchant'}
          </h1>
          <p className="text-xs text-slate-400">
            {isEditing
              ? 'Changes save directly to Supabase and become live immediately'
              : 'Onboard a new merchant into the ReviewSmart ecosystem'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {businessSlug && (
            <button
              type="button"
              onClick={() => API.openExternal(getReviewPageUrl(businessSlug))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
            >
              <span>View Live QR Page</span>
              <ExternalLink size={13} />
            </button>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate('merchants')}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Save size={16} />}
            loading={saving}
            onClick={handleSave}
          >
            {isEditing ? 'Save Changes' : 'Create Merchant'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Identity & Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-semibold text-sm">
            <Store size={18} className="text-indigo-400" />
            <span>Business Profile & Contact</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business Display Name"
              placeholder="e.g. VR GOLD - KADAPA"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Select
              label="Industry / Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />

            <Input
              label="Owner / Contact Person Name"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Contact Phone / Mobile (10 Digits)"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              required
              hint="Used as login ID for the merchant portal"
            />

            <div className="md:col-span-2">
              <Input
                label="Tagline / Header Description"
                placeholder="e.g. Review our service & share your experience!"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Google Maps Setup & Direct Review Link */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <MapPin size={18} className="text-emerald-400" />
              <span>Google Maps & 5-Star Review Popup</span>
            </div>
            {googlePlaceId ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle size={14} /> Place ID Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <ShieldAlert size={14} /> Place ID Missing
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Google Maps Profile Link or Share URL"
                    placeholder="https://maps.app.goo.gl/... or https://share.google/..."
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    hint="Paste any Google Maps link. Click 'Auto-Resolve' to extract the Place ID for direct review popups."
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleResolveGoogleUrl}
                  loading={resolvingUrl}
                  icon={<Sparkles size={14} className="text-indigo-400" />}
                >
                  Auto-Resolve
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Google Place ID (ChIJ...)"
                placeholder="e.g. ChIJbzsJc9NzszsRtBUfS0gXCHk"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                hint="Used to trigger the Google 5-star write-review popup directly"
              />

              <Input
                label="Physical Address (Optional)"
                placeholder="Shop No. 4, Main Road, Kadapa..."
                value={googleAddress}
                onChange={(e) => setGoogleAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: AI Review Booster Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Sparkles size={18} className="text-indigo-400" />
              <span>AI Review Generation Settings</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Sparkles size={14} className="text-indigo-400" />}
              loading={generatingChips}
              onClick={handleGenerateAiChips}
            >
              Generate Chips via Gemini
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1">
                Review Tag Chips (Comma Separated)
              </label>
              <Textarea
                rows={2}
                placeholder="Friendly Staff,Fast Service,Great Quality,Fair Pricing,Clean Ambiance"
                value={tagChips}
                onChange={(e) => setTagChips(e.target.value)}
                hint="Chips shown to customers on the review page. Selected chips dictate AI review text."
              />
              {/* Chip preview */}
              {tagChips && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagChips
                    .split(',')
                    .map((c) => c.trim())
                    .filter(Boolean)
                    .map((chip, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-indigo-300 border border-slate-700 font-medium"
                      >
                        {chip}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <Textarea
              label="Keywords & Specific Service Instructions"
              rows={3}
              placeholder="e.g. Old gold buying, cash for gold, purity testing, quick payment, valuation"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              hint="Crucial for strict business-specific review generation. Prevents generic reviews."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Review Prompt Tone"
                value={reviewPromptTone}
                onChange={(e) => setReviewPromptTone(e.target.value)}
                options={[
                  { value: 'friendly', label: 'Friendly & Welcoming' },
                  { value: 'professional', label: 'Professional & Trustworthy' },
                  { value: 'enthusiastic', label: 'Enthusiastic & High Energy' },
                  { value: 'casual', label: 'Casual & Direct' },
                ]}
              />

              <Select
                label="Minimum Rating for Google Redirect"
                value={String(minRatingForGoogle)}
                onChange={(e) => setMinRatingForGoogle(Number(e.target.value))}
                options={[
                  { value: '4', label: '4 Stars and Above (Standard Shield)' },
                  { value: '5', label: '5 Stars Only (Strict Shield)' },
                  { value: '3', label: '3 Stars and Above' },
                ]}
                hint="Lower ratings are captured privately in the private feedback log."
              />
            </div>
          </div>
        </div>

        {/* Section 4: Package, QR Mode & Deployment Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-semibold text-sm">
            <Layers size={18} className="text-indigo-400" />
            <span>Card Package, QR Mode & Live Status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="QR Code Destination Mode"
              value={qrMode}
              onChange={(e) => setQrMode(e.target.value)}
              options={[
                { value: 'SMART_HUB', label: 'Smart Hub (All Links + Booster)' },
                { value: 'REVIEW_BOOSTER', label: 'Review Booster Direct (Opens Review Directly)' },
              ]}
            />

            <Select
              label="Package Tier"
              value={packageTier}
              onChange={(e) => setPackageTier(e.target.value)}
              options={PACKAGE_TIERS}
            />

            <Select
              label="Customer Onboarding Type"
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              options={[
                { value: 'OFFLINE', label: 'Offline / Agent Field Sale' },
                { value: 'ONLINE', label: 'Online / Direct Sign Up' },
              ]}
            />
          </div>

          {/* Paid / Live Toggle */}
          <div className="pt-2 flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-white">Live Production Status (isPaid)</p>
              <p className="text-xs text-slate-400">
                When enabled, the merchant card is fully live without demo expiration limits.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Section 5: Branding & Social Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-semibold text-sm">
            <Palette size={18} className="text-indigo-400" />
            <span>Branding & Social Profiles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Logo Image URL"
              placeholder="https://..."
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded border border-slate-700 bg-slate-800 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>

            <Input
              label="WhatsApp Number (with country code)"
              placeholder="e.g. 918639831132"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />

            <Input
              label="Website URL"
              placeholder="https://..."
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />

            <Input
              label="Instagram Profile"
              placeholder="https://instagram.com/..."
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />

            <Input
              label="Facebook Page"
              placeholder="https://facebook.com/..."
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('merchants')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Save size={18} />}
            loading={saving}
          >
            {isEditing ? 'Save All Changes' : 'Create Merchant'}
          </Button>
        </div>
      </form>

      {/* New Merchant Success Modal with PIN */}
      {newMerchantResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Merchant Created!</h3>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-indigo-300 font-semibold">{newMerchantResult.name}</span> has been saved to the live database.
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Merchant Login PIN</p>
              <p className="text-3xl font-mono font-bold text-emerald-400 mt-1 tracking-widest">
                {newMerchantResult.pin}
              </p>
            </div>
            <p className="text-xs text-slate-400">
              The merchant can log in using their 10-digit mobile number and this 4-digit PIN.
            </p>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => {
                setNewMerchantResult(null)
                onNavigate('merchants')
              }}
            >
              Go to Merchants List
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
