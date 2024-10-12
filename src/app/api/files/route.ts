// src/app/api/files/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const files = await prisma.upload.findMany();
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading files from database:', error);
    return NextResponse.json({ files: [] }, { status: 500 });
  }
}
