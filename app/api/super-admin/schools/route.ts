import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateSlug, generateUniqueId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, country, email, phone, adminName, adminEmail, planId } = body;

    if (!name || !type || !country || !adminName || !adminEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let slug = generateSlug(name);
    
    const existingSchool = await prisma.school.findUnique({
      where: { slug },
    });

    if (existingSchool) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    let plan = await prisma.plan.findFirst({
      where: { name: planId === 'trial' ? 'Trial' : planId === 'basic' ? 'Basic' : planId === 'premium' ? 'Premium' : 'Enterprise' },
    });

    if (!plan) {
      plan = await prisma.plan.create({
        data: {
          name: 'Trial',
          studentLimit: 50,
          certificatePrintingAllowed: true,
          customDomainEnabled: false,
          price: 0,
          features: {},
        },
      });
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    const tempPassword = generateUniqueId('PWD-');
    const hashedPassword = await hashPassword(tempPassword);

    const school = await prisma.school.create({
      data: {
        name,
        slug,
        type,
        country,
        email,
        phone,
        planId: plan.id,
        status: planId === 'trial' ? 'trial' : 'active',
        trialEndsAt: planId === 'trial' ? trialEndsAt : null,
        users: {
          create: {
            email: adminEmail,
            password: hashedPassword,
            name: adminName,
            role: 'SCHOOL_ADMIN',
            isActive: true,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json({
      success: true,
      school,
      credentials: {
        email: adminEmail,
        password: tempPassword,
        },
        });
        } catch (error) {
        console.error('Error creating school:', error);
        return NextResponse.json(
        { error: 'Failed to create school' },
        { status: 500 }
        );
        }
        }

        export async function GET() {
        try {
    const schools = await prisma.school.findMany({
      include: {
        plan: true,
        _count: {
          select: {
            users: true,
            students: true,
            teachers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}
