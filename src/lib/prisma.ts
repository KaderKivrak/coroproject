// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Hvis vi er i et udviklingsmiljø (development mode), gemmer vi Prisma-klienten globalt.
// Dette sikrer, at vi ikke initialiserer flere Prisma-klienter ved hot-reloading i Next.js.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Dette logger forespørgslerne til databasen (valgfrit)
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
