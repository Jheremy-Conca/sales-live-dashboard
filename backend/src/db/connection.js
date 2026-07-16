import { PrismaClient } from '@prisma/client';

// Un solo PrismaClient para toda la app. Crear una instancia nueva
// por archivo agota las conexiones a la base rápido, sobre todo en
// desarrollo con hot-reload.
export const prisma = new PrismaClient();

export async function connectDB() {
  await prisma.$connect();
  console.log('🐘 Conectado a PostgreSQL');
}

export async function disconnectDB() {
  await prisma.$disconnect();
}