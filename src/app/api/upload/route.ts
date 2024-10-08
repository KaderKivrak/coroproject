import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.formData();
  const file = data.get('file') as File;
  const name = data.get('name') as string;
  const description = data.get('description') as string;
  const company = data.get('company') as string;

  if (!file || !name || !description || !company) {
    return NextResponse.json({ success: false, message: 'All fields are required' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = join(process.cwd(), 'public', 'uploads', file.name);
  await mkdir(join(process.cwd(), 'public', 'uploads'), { recursive: true });
  await writeFile(filePath, buffer);

  const upload = await prisma.upload.create({
    data: {
      fileName: file.name,
      name,
      description,
      company,
      userId: parseInt(session.user.id, 10),
    },
  });

  return NextResponse.json({ success: true, upload });
}
