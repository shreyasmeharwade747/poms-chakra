import { NextRequest, NextResponse } from 'next/server';
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
    // For now, return mock automotive parts data
    const mockItems = [
      {
        id: 'item_1',
        companyId: id,
        partyId: null,
        name: 'Brake Pads Set',
        description: 'High-performance ceramic brake pads for automotive vehicles',
        sku: 'BP-001',
        unit: 'set',
        hsnCode: '87083000',
        basePrice: 2500.00,
        gstRate: 18.00,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'item_2',
        companyId: id,
        partyId: null,
        name: 'Engine Oil Filter',
        description: 'Premium oil filter for diesel engines',
        sku: 'EOF-002',
        unit: 'pcs',
        hsnCode: '84212300',
        basePrice: 450.00,
        gstRate: 18.00,
        createdAt: '2024-01-16T11:30:00Z',
        updatedAt: '2024-01-16T11:30:00Z',
      },
      {
        id: 'item_3',
        companyId: id,
        partyId: null,
        name: 'Spark Plugs (Set of 4)',
        description: 'Iridium spark plugs for petrol engines',
        sku: 'SP-003',
        unit: 'set',
        hsnCode: '85111000',
        basePrice: 1200.00,
        gstRate: 18.00,
        createdAt: '2024-01-17T14:20:00Z',
        updatedAt: '2024-01-17T14:20:00Z',
      },
      {
        id: 'item_4',
        companyId: id,
        partyId: null,
        name: 'Air Filter',
        description: 'Cabin air filter for passenger vehicles',
        sku: 'AF-004',
        unit: 'pcs',
        hsnCode: '84213100',
        basePrice: 350.00,
        gstRate: 18.00,
        createdAt: '2024-01-18T09:15:00Z',
        updatedAt: '2024-01-18T09:15:00Z',
      },
    ];

    return NextResponse.json({ data: mockItems });
  } catch (error) {
    console.error('[GET /api/company/[id]/items] Failed:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
