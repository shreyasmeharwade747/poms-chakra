import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Verify the company belongs to the user
    const company = await prisma.company.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Fetch suppliers (parties) for this company
    const suppliers = await prisma.party.findMany({
      where: {
        companyId: id,
      },
      select: {
        id: true,
        name: true,
        gstin: true,
        phone: true,
        email: true,
        address: true,
        stateCode: true,
        isRegisteredGst: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: suppliers });
  } catch (error) {
    console.error('[GET /api/company/[id]/suppliers] Failed:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    // Verify the company belongs to the user
    const company = await prisma.company.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Create the supplier (party)
    const supplier = await prisma.party.create({
      data: {
        companyId: id,
        name: body.name,
        gstin: body.gstin || null,
        phone: body.phone || null,
        email: body.email || null,
        address: body.address || null,
        stateCode: body.stateCode || null,
        isRegisteredGst: body.isRegisteredGst ?? true,
      },
      select: {
        id: true,
        name: true,
        gstin: true,
        phone: true,
        email: true,
        address: true,
        stateCode: true,
        isRegisteredGst: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: supplier }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/company/[id]/suppliers] Failed:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
