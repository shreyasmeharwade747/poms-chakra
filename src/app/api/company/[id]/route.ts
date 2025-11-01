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
    const company = await prisma.company.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        gstin: true,
        pan: true,
        address: true,
        stateCode: true,
        email: true,
        phone: true,
        logoUrl: true,
        gstType: true,
        parties: {
          select: {
            id: true,
            name: true,
            gstin: true,
            phone: true,
            email: true,
            address: true,
            stateCode: true,
            isRegisteredGst: true,
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ data: company });
  } catch (error) {
    console.error('[GET /api/company/[id]] Failed:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}
