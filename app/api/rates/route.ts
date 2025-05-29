// /pages/api/rates.ts
import { Redis } from '@upstash/redis';
import { getTodayKey } from '@/app/utils';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
    const key = getTodayKey();
  
    let data = await redis.get(key);
  
    if (!data) {
        // get exchange from usd
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      data = await response.json();
      await redis.set(key, data, { ex: 86400 }); // TTL 1 hari
    }
  
    return Response.json(data);
}