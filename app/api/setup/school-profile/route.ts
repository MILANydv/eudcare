import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !session.user.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { address, phone, principalName } = body;

    if (!address || !phone || !principalName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const school = await prisma.school.update({
      where: { id: session.user.schoolId },
      data: {
        address,
        phone,
        principalName,
      },
    });

    await prisma.academicYear.updateMany({
      where: {
        schoolId: session.user.schoolId,
        isCurrent: true,
      },
      data: {
        isSetupComplete: true,
      },
    });

    return NextResponse.json({ success: true, school });
  } catch (error) {
    console.error('Error updating school profile:', error);
    return NextResponse.json(
      { error: 'Failed to update school profile' },
      { status: 500 }
    );
  }
}
