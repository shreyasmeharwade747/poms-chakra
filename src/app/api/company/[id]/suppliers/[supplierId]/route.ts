import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; supplierId: string }> }
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, supplierId } = await params;

  try {
    const companyId = id;

    // Verify the company belongs to the user
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        userId: session.user.id,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Fetch the specific supplier
    const supplier = await prisma.party.findFirst({
      where: {
        id: supplierId,
        companyId: companyId,
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
      },
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    return NextResponse.json({ data: supplier });
  } catch (error) {
    console.error('[GET /api/company/[id]/suppliers/[supplierId]] Failed:', error);
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; supplierId: string }> }
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, supplierId } = await params;

  try {
    const companyId = id;
    const body = await request.json();

    // Verify the company belongs to the user
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        userId: session.user.id,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Verify the supplier exists and belongs to the company
    const existingSupplier = await prisma.party.findFirst({
      where: {
        id: supplierId,
        companyId: companyId,
      },
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    // Update the supplier
    const updatedSupplier = await prisma.party.update({
      where: {
        id: supplierId,
      },
      data: {
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
      },
    });

    return NextResponse.json({ data: updatedSupplier });
  } catch (error) {
    console.error('[PUT /api/company/[id]/suppliers/[supplierId]] Failed:', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}
