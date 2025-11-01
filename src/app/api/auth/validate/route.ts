import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ valid: false, error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ valid: false, error: 'Account doesn\'t exist' });
  }

  const validPassword = await compare(password, user.password);

  if (!validPassword) {
    return NextResponse.json({ valid: false, error: 'Email password doesn\'t match' });
  }

  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;

  return NextResponse.json({ valid: true, user: userWithoutPassword });
}
