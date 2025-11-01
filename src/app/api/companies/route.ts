import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  gstin: z
    .string()
    .min(1, 'GSTIN is required')
    .max(15, 'GSTIN must be 15 characters')
    .regex(/^[0-9A-Z]{15}$/, 'GSTIN must be 15 characters (numbers or uppercase letters)')
    .optional(),
  pan: z
    .string()
    .length(10, 'PAN must be 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN format')
    .optional(),
  address: z.string().optional(),
  stateCode: z.string().max(5).optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().max(20).optional(),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  gstType: z.enum(['INTRA_STATE', 'INTER_STATE']).default('INTRA_STATE'),
});

const updateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  gstin: z.string().refine((val) => val === '' || (val.length === 15 && /^[0-9A-Z]{15}$/.test(val)), {
    message: 'GSTIN must be empty or exactly 15 characters (numbers and uppercase letters only)',
  }),
  pan: z.string().refine((val) => val === '' || (val.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(val)), {
    message: 'PAN must be empty or exactly 10 characters in valid format',
  }),
  address: z.string(),
  stateCode: z.string(),
  email: z.string().refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Email must be empty or a valid email address',
  }),
  phone: z.string(),
  logoUrl: z.string().refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
    message: 'Logo URL must be empty or a valid URL',
  }),
  gstType: z.enum(['INTRA_STATE', 'INTER_STATE']),
});

function mapPrismaError(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const { code } = error as { code?: string };
    if (code === 'P2002') {
      return NextResponse.json({ error: 'GSTIN already exists' }, { status: 409 });
    }
  }

  console.error('[POST /api/companies] Failed:', error);
  return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = createCompanySchema.parse(body);

    const company = await prisma.company.create({
      data: {
        userId: session.user.id,
        name: payload.name,
        gstin: payload.gstin ?? null,
        pan: payload.pan ?? null,
        address: payload.address ?? null,
        stateCode: payload.stateCode ?? null,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        logoUrl: payload.logoUrl ?? null,
        gstType: payload.gstType,
      },
    });

    return NextResponse.json({ data: company }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid payload' }, { status: 422 });
    }

    if ((error as { code?: string })?.code) {
      return mapPrismaError(error);
    }

    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const companies = await prisma.company.findMany({
      where: { userId: session.user.id },
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
        gstType: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: companies });
  } catch (error) {
    console.error('[GET /api/companies] Failed:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('id');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    const body = await request.json();
    console.log('[PUT /api/companies] Received body:', JSON.stringify(body, null, 2));
    console.log('[PUT /api/companies] Company ID:', companyId);

    const payload = updateCompanySchema.parse(body);
    console.log('[PUT /api/companies] Validation passed, payload:', JSON.stringify(payload, null, 2));

    // Verify user owns the company before updating
    const existing = await prisma.company.findFirst({
      where: { 
        id: companyId,
        userId: session.user.id 
      }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: payload.name,
        gstin: payload.gstin ?? null,
        pan: payload.pan ?? null,
        address: payload.address ?? null,
        stateCode: payload.stateCode ?? null,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        logoUrl: payload.logoUrl ?? null,
        gstType: payload.gstType,
      },
    });

    return NextResponse.json({ data: company });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('[PUT /api/companies] Zod validation error:', error.issues);
      console.error('[PUT /api/companies] Zod validation error details:', JSON.stringify(error.issues, null, 2));
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid payload' }, { status: 422 });
    }

    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'GSTIN already exists' }, { status: 409 });
    }

    console.error('[PUT /api/companies] Failed:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}
