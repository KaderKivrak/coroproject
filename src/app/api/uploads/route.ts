import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ uploads: [] }); // Hvis brugeren ikke er logget ind, returner en tom liste
  }

  const uploads = await prisma.upload.findMany({
    where: { userId: parseInt(session.user.id, 10) }, // Hent uploads baseret på userId
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ uploads });
}
