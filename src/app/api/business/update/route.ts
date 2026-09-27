import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      businessId,
      name,
      tagline,
      category,
      primaryColor,
      tagChips,
      reviewPromptTone,
      whatsapp,
      instagram,
      website,
      phone,
      minRatingForGoogle,
      googleAddress,
      googleReviewUrl,
      logoUrl,
      qrMode,
      menuUrl,
      customUpiId,
      visitingCardBackMode,
      visitingCardOwnerName,
      visitingCardOwnerTitle,
      visitingCardPhone,
      visitingCardEmail,
      visitingCardAddress,
      visitingCardImageUrl,
    } = body;

    let business;
    if (businessId) {
      business = await prisma.business.findUnique({ where: { id: businessId } });
      if (!business) return NextResponse.json({ error: 'No business found.' }, { status: 404 });

      // Check permission
      if (user.role === 'SUPER_ADMIN') {
        // permitted
      } else if (user.role === 'MARKETING_AGENT') {
        const merchantUser = await prisma.user.findUnique({
          where: { id: business.userId },
          select: { referredBy: true },
        });
        const payment = await prisma.upiPayment.findFirst({
          where: {
            agentId: user.id,
            OR: [{ businessId: business.id }, { userId: business.userId }],
          },
        });
        if (merchantUser?.referredBy !== user.id && !payment) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      } else if (business.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      business = await prisma.business.findFirst({ where: { userId: user.id } });
      if (!business) return NextResponse.json({ error: 'No business found.' }, { status: 404 });
    }

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        ...(name !== undefined && { name }),
        ...(tagline !== undefined && { tagline }),
        ...(category !== undefined && { category }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(tagChips !== undefined && { tagChips }),
        ...(reviewPromptTone !== undefined && { reviewPromptTone }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(instagram !== undefined && { instagram }),
        ...(website !== undefined && { website }),
        ...(phone !== undefined && { phone }),
        ...(googleAddress !== undefined && { googleAddress }),
        ...(googleReviewUrl !== undefined && { googleReviewUrl }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(qrMode !== undefined && { qrMode }),
        ...(menuUrl !== undefined && { menuUrl }),
        ...(customUpiId !== undefined && { customUpiId }),
        ...(visitingCardBackMode !== undefined && { visitingCardBackMode }),
        ...(visitingCardOwnerName !== undefined && { visitingCardOwnerName }),
        ...(visitingCardOwnerTitle !== undefined && { visitingCardOwnerTitle }),
        ...(visitingCardPhone !== undefined && { visitingCardPhone }),
        ...(visitingCardEmail !== undefined && { visitingCardEmail }),
        ...(visitingCardAddress !== undefined && { visitingCardAddress }),
        ...(visitingCardImageUrl !== undefined && { visitingCardImageUrl }),
        ...(minRatingForGoogle !== undefined && { minRatingForGoogle: Number(minRatingForGoogle) }),
      },
    });

    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error('Business update error:', error);
    return NextResponse.json({ error: 'Failed to update business.' }, { status: 500 });
  }
}
