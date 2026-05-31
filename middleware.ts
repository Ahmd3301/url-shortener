import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.slice(1);

  // تجاهل المسارات الداخلية
  if (!slug || slug.startsWith("api/") || slug.startsWith("_next/")) {
    return NextResponse.next();
  }

  // L1: Next.js Edge Cache عبر headers
  const cacheKey = `url:${slug}`;

  const url = await redis.get<string>(cacheKey);

  if (!url) return NextResponse.next(); // → 404

  const res = NextResponse.redirect(url, 302);

  // L2: Vercel Edge Cache لمدة 5 دقائق
  res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");

  return res;
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"],
};
