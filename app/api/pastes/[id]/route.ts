import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { Paste } from "@/lib/types";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is now a Promise
) {
  const { id } = await context.params; // unwrap the Promise
  const key = `paste:${id}`;
  const paste = await redis.get<Paste>(key);

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = Date.now();

  if (paste.expires_at && now >= paste.expires_at) {
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views_used >= paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.views_used += 1;
  await redis.set(key, paste);

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : paste.max_views - paste.views_used,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
