// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Tjek, om brugeren allerede findes
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  // Hash passwordet
  const hashedPassword = await bcrypt.hash(password, 10);

  // Opret ny bruger i databasen
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'user', // Tildel standardrolle som "user"
    },
  });

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}
