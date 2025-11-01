import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';

import { prisma } from '@/lib/prisma';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const MIN_PASSWORD_LENGTH = 8;

function parsePagination(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const pageSizeParam = searchParams.get('pageSize');

  const page = Number(pageParam) || DEFAULT_PAGE;
  const pageSize = Number(pageSizeParam) || DEFAULT_PAGE_SIZE;

  if (!Number.isInteger(page) || page < 1) {
    throw new Error('INVALID_PAGE');
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw new Error('INVALID_PAGE_SIZE');
  }

  return { page, pageSize };
}

export async function GET(request: NextRequest) {
  let pagination: { page: number; pageSize: number };

  try {
    pagination = parsePagination(request);
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_PAGE') {
      return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'INVALID_PAGE_SIZE') {
      return NextResponse.json(
        { error: `pageSize must be between 1 and ${MAX_PAGE_SIZE}` },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: 'Unknown pagination error' }, { status: 400 });
  }

  const { page, pageSize } = pagination;
  const skip = (page - 1) * pageSize;

  try {
    const [items, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return NextResponse.json({
      data: items,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/users] Failed:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

type UserRole = 'SUPER_ADMIN' | 'USER';

interface CreateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

function parseCreatePayload(body: unknown): asserts body is Required<CreateUserPayload> {
  if (!body || typeof body !== 'object') {
    throw new Error('INVALID_BODY');
  }

  const { name, email, password, role, isActive } = body as CreateUserPayload;

  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new Error('INVALID_NAME');
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('INVALID_EMAIL');
  }

  if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error('INVALID_PASSWORD');
  }

  if (!role || !['SUPER_ADMIN', 'USER'].includes(role)) {
    throw new Error('INVALID_ROLE');
  }

  if (typeof isActive !== 'boolean') {
    throw new Error('INVALID_STATUS');
  }
}

function mapCreateError(error: unknown) {
  if (!(error instanceof Error)) {
    return { message: 'Unknown error', status: 500 };
  }

  switch (error.message) {
    case 'INVALID_BODY':
      return { message: 'Invalid request body', status: 400 };
    case 'INVALID_NAME':
      return { message: 'Name is required', status: 422 };
    case 'INVALID_EMAIL':
      return { message: 'Valid email is required', status: 422 };
    case 'INVALID_PASSWORD':
      return {
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        status: 422,
      };
    case 'INVALID_ROLE':
      return { message: 'Role must be SUPER_ADMIN or USER', status: 422 };
    case 'INVALID_STATUS':
      return { message: 'isActive must be a boolean', status: 422 };
    case 'P2002':
      return { message: 'Email already exists', status: 409 };
    default:
      return { message: 'Failed to create user', status: 500 };
  }
}

export async function POST(request: NextRequest) {
  let body: CreateUserPayload;

  try {
    body = await request.json();
    parseCreatePayload(body);
  } catch (error) {
    const mapped = mapCreateError(error);
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }

  try {
    const hashedPassword = await hash(body.password!, 12);

    const createdUser = await prisma.user.create({
      data: {
        name: body.name!,
        email: body.email!,
        password: hashedPassword,
        role: body.role!,
        isActive: body.isActive!,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: createdUser }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/users] Failed:', error);
    const mapped = mapCreateError((error as { code?: string })?.code ? new Error((error as { code?: string }).code) : error);
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
