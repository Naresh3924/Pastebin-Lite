import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import { Paste } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  // Validation
  if (!content || typeof content !== "string" || content.trim() === "") {
    return NextResponse.json(
      { error: "Content must be a non-empty string" },
      { status: 400 }
    );
  }

  if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return NextResponse.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
    return NextResponse.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  const id = uuidv4();
  const now = Date.now();

  const paste: Paste = {
    id,
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views_used: 0,
  };

  await redis.set(`paste:${id}`, paste);

  return NextResponse.json(
    {
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    },
    { status: 201 }
  );
}
