import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { nanoid } from "nanoid";

const DAILY_LIMIT = 9000;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // Validate URL
    try { new URL(url); } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // فحص الحد اليومي (قرار A)
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const counterKey = `daily:${today}`;

    const count = await redis.incr(counterKey);

    if (count === 1) {
      // أول استخدام اليوم — اضبط انتهاء الصلاحية 24 ساعة
      await redis.expire(counterKey, 86400);
    }

    if (count > DAILY_LIMIT) {
      return NextResponse.json(
        { error: "Daily limit reached. Try again tomorrow." },
        { status: 503 }
      );
    }

    // إنشاء الرابط المختصر
    const slug = nanoid(8);
    await redis.set(`url:${slug}`, url);

    const shortUrl = `${req.nextUrl.origin}/${slug}`;
    return NextResponse.json({ shortUrl });

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
