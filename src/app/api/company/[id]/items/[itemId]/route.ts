import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ensureCompanyOwnership = async (companyId: string, userId: string) => {
  return prisma.company.findFirst({
    where: {
      id: companyId,
      userId,
    },
    select: { id: true },
  });
};

const normaliseDecimal = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') return value.trim() === '' ? undefined : value;
  if (typeof value === 'number') return value.toString();
  return undefined;
};

const itemSelect = {
  id: true,
  companyId: true,
  partyId: true,
  name: true,
  description: true,
  sku: true,
  unit: true,
  hsnCode: true,
  basePrice: true,
  gstRate: true,
  createdAt: true,
  updatedAt: true,
} as const;

type ItemRecord = Prisma.ItemGetPayload<{ select: typeof itemSelect }>;

const serializeItem = (item: ItemRecord) => ({
  ...item,
  basePrice: item.basePrice.toNumber(),
  gstRate: item.gstRate.toNumber(),
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: companyId, itemId } = await params;

  try {
    const company = await ensureCompanyOwnership(companyId, session.user.id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        companyId,
      },
      select: itemSelect,
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ data: serializeItem(item) });
  } catch (error) {
    console.error('[GET /api/company/[id]/items/[itemId]] Failed:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: companyId, itemId } = await params;
  const body = await request.json();

  try {
    const company = await ensureCompanyOwnership(companyId, session.user.id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const existingItem = await prisma.item.findFirst({
      where: {
        id: itemId,
        companyId,
      },
      select: { id: true },
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found for this company' }, { status: 404 });
    }

    if (!body.partyId) {
      return NextResponse.json({ error: 'partyId is required' }, { status: 400 });
    }

    const supplier = await prisma.party.findFirst({
      where: {
        id: body.partyId,
        companyId,
      },
      select: { id: true },
    });

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found for this company' }, { status: 400 });
    }

    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const basePriceNormalised = normaliseDecimal(body.basePrice);
    const gstRateNormalised = normaliseDecimal(body.gstRate);

    const basePrice = Number.parseFloat(basePriceNormalised ?? '');
    const gstRate = Number.parseFloat(gstRateNormalised ?? '');

    if (Number.isNaN(basePrice) || basePrice < 0) {
      return NextResponse.json({ error: 'Base price must be a non-negative number' }, { status: 400 });
    }

    if (Number.isNaN(gstRate) || gstRate < 0 || gstRate > 100) {
      return NextResponse.json({ error: 'GST rate must be between 0 and 100' }, { status: 400 });
    }

    const basePriceDecimal = new Prisma.Decimal(basePrice.toFixed(2));
    const gstRateDecimal = new Prisma.Decimal(gstRate.toFixed(2));

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        partyId: body.partyId,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        sku: body.sku?.trim() || null,
        unit: body.unit?.trim() || null,
        hsnCode: body.hsnCode?.trim() || null,
        basePrice: basePriceDecimal,
        gstRate: gstRateDecimal,
      },
      select: itemSelect,
    });

    return NextResponse.json({ data: serializeItem(updatedItem) });
  } catch (error) {
    console.error('[PATCH /api/company/[id]/items/[itemId]] Failed:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
