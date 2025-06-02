import { prisma } from "./prisma"
import { Redis } from "@upstash/redis"
import { getTodayKey } from "./utils"
import { Prisma } from "@prisma/client";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getConversionRateFromUSD(toCurrency: string) {
  const key = getTodayKey();
  let data = await redis.get<{ rates: Record<string, number> }>(key);

  if (!data) {
    console.log("Fetching exchange rate from API")
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    data = await response.json();
    await redis.set(key, data, { ex: 86400 }); // TTL 1 day
  }

  const rate = data?.rates?.[toCurrency];

  if (typeof rate !== 'number') {
    throw new Error(`Conversion rate for ${toCurrency} not found`);
  }

  return rate;
}

export async function getUser(userId: string) {
  return await prisma.user.findUnique({ where: { id: userId } })
}

export async function getTransactions(
  userId: string,
  filter?: {
    category?: string;
    currency?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  return await prisma.transaction.findMany({
    where: {
      userId,
      ...(filter?.category && { category: filter.category }),
      ...(filter?.currency && { currency: filter.currency }),
      ...(filter?.search && {
        OR: [
          { name: { contains: filter.search } },
          { description: { contains: filter.search } },
        ]
      }),
      ...(filter?.startDate && {
        createdAt: { gte: filter.startDate }
      }),
      ...(filter?.endDate && {
        createdAt: {
          ...(filter?.startDate ? { gte: filter.startDate } : {}),
          lte: filter.endDate
        }
      }),
    },
  })
}

export async function createTransaction(transaction: Prisma.TransactionCreateInput) {
  return await prisma.transaction.create({ data: transaction })
}

export async function isTransactionOwnedByUser(transactionId: string, userId: string): Promise<boolean> {
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    select: { userId: true }
  })

  return tx?.userId === userId
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const owned = await isTransactionOwnedByUser(transactionId, userId)
  if (!owned) {
    throw new Error("Unauthorized or transaction not found")
  }

  return await prisma.transaction.delete({
    where: { id: transactionId }
  })
}

export async function updateTransaction(userId: string, data: {
  id: string,
  name: string,
  description: string,
  category: string,
  amount: number,
  currency: string,
}) {
  return await prisma.transaction.update({
    where: {
      id: data.id,
      userId: userId,
    },
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      amount: data.amount,
      currency: data.currency,
    },
  })
}