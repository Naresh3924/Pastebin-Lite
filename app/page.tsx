import { redis } from "@/lib/redis";
import { Paste } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await redis.get<Paste>(`paste:${params.id}`);

  if (!paste) notFound();

    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

  if (
    (paste.expires_at && now >= paste.expires_at) ||
    (paste.max_views !== null && paste.views_used >= paste.max_views)
  ) {
    notFound();
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Paste</h1>
      <pre>{paste.content}</pre>
    </main>
  );
}
