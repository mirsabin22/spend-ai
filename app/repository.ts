import { PrismaClient } from "@prisma/client"
import { Redis } from "@upstash/redis"
import { getTodayKey } from "./utils"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

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