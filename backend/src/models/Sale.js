import { prisma } from '../db/connection.js';

export async function createSale({ product, region, quantity, amount }) {
  return prisma.sale.create({
    data: { product, region, quantity, amount },
  });
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getTodaysSales(limit = 15) {
  return prisma.sale.findMany({
    where: { createdAt: { gte: startOfToday() } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getTodaysStats() {
  const result = await prisma.sale.aggregate({
    where: { createdAt: { gte: startOfToday() } },
    _sum: { amount: true },
    _count: { id: true },
  });

  const totalVentasDia = result._sum.amount || 0;
  const contadorVentas = result._count.id || 0;

  return {
    totalVentasDia,
    contadorVentas,
    ticketPromedio: contadorVentas > 0 ? totalVentasDia / contadorVentas : 0,
  };
}

export async function getTodaysSalesByProduct() {
  const grouped = await prisma.sale.groupBy({
    by: ['product'],
    where: { createdAt: { gte: startOfToday() } },
    _sum: { quantity: true },
  });
  return Object.fromEntries(grouped.map((g) => [g.product, g._sum.quantity]));
}

export async function getTodaysSalesByRegion() {
  const grouped = await prisma.sale.groupBy({
    by: ['region'],
    where: { createdAt: { gte: startOfToday() } },
    _sum: { amount: true },
  });
  return Object.fromEntries(grouped.map((g) => [g.region, g._sum.amount]));
}