import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  const { id, status, feedback } = await request.json(); // Feedback sendes nu sammen med status

  try {
    // Opdater status og feedback for uploaden
    const updatedUpload = await prisma.upload.update({
      where: { id },
      data: { status, feedback },
    });

    return NextResponse.json({ success: true, updatedUpload });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update status' }, { status: 500 });
  }
}
