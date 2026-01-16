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
    const { name, startDate, endDate } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        schoolId: session.user.schoolId,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: true,
      },
    });

    return NextResponse.json({ success: true, academicYear });
  } catch (error) {
    console.error('Error creating academic year:', error);
    return NextResponse.json(
      { error: 'Failed to create academic year' },
      { status: 500 }
    );
  }
}
