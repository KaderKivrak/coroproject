// src/app/api/admin/upload/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '../../../../../lib/prisma';

export async function PATCH(request: NextRequest, { params }: any) {
  const { id } = params;
  const { status } = await request.json();

  await prisma.upload.update({
    where: { id: Number(id) },
    data: { status },
  });

  return NextResponse.json({ success: true });
}
