import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'BUSINESS_OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tagline, primaryColor, tagChips, reviewPromptTone, whatsapp, instagram, website, phone, minRatingForGoogle } = body;

    // Only update the business that belongs to this user
    const business = await prisma.business.findFirst({ where: { userId: user.id } });
    if (!business) return NextResponse.json({ error: 'No business found.' }, { status: 404 });

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        ...(tagline !== undefined && { tagline }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(tagChips !== undefined && { tagChips }),
        ...(reviewPromptTone !== undefined && { reviewPromptTone }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(instagram !== undefined && { instagram }),
        ...(website !== undefined && { website }),
        ...(phone !== undefined && { phone }),
        ...(minRatingForGoogle !== undefined && { minRatingForGoogle: Number(minRatingForGoogle) }),
      },
    });

    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error('Business update error:', error);
    return NextResponse.json({ error: 'Failed to update business.' }, { status: 500 });
  }
}
