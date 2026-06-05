import { NextRequest, NextResponse } from "next/server";

const rateLimit = new Map<
  string,
  { count: number; resetTime: number }
>();

export function rateLimiter(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return (req: NextRequest) => {
    const identifier = req.ip || req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    const record = rateLimit.get(identifier);

    if (!record || now > record.resetTime) {
      rateLimit.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null;
    }

    if (record.count >= maxRequests) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    record.count++;
    return null;
  };
}
