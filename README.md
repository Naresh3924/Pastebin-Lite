# Pastebin Lite

A lightweight Pastebin app using **Next.js (App Router)** + **Upstash Redis** for temporary pastes with **TTL** and **max views**.

---

## Features

- Create, fetch, and view pastes
- TTL (Time-to-Live) support
- Max view limits
- Dynamic routing: `/p/[id]`
- JSON API + browser view

---

## Folder Structure

pastebin-lite/
├─ app/
│ ├─ api/pastes/route.ts ← POST
│ └─ api/pastes/[id]/route.ts ← GET
│ ├─ page.tsx
│ └─ layout.tsx
├─ lib/
│ ├─ redis.ts
│ └─ types.ts
├─ .env.local
├─ package.json
├─ README.md

yaml
Copy code

---

## Environment Variables

`.env.local` (root):

UPSTASH_REDIS_REST_URL=<your_upstash_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_token>
NEXT_PUBLIC_BASE_URL=http://localhost:3000

yaml
Copy code

> In Vercel, set `NEXT_PUBLIC_BASE_URL` to your live URL.

---

## How It Works

### Create Paste (POST)
POST /api/pastes
Body:
{
"content": "Hello Aganitha",
"ttl_seconds": 60,
"max_views": 3
}
Response:
{
"id": "<PASTE_ID>",
"url": "http://localhost:3000/p/<PASTE_ID>"
}

shell
Copy code

### Fetch Paste (GET API)
GET /api/pastes/<PASTE_ID>
Response:
{
"content": "Hello Aganitha",
"remaining_views": 2,
"expires_at": "2025-12-30T10:00:00.000Z"
}

graphql
Copy code

### View Paste in Browser
GET /p/<PASTE_ID>

yaml
Copy code
- Shows plain HTML
- Refresh counts as a view
- After TTL or max views → 404

---

## Local Testing

```bash
npm install
npm run dev
Health check:

arduino
Copy code
http://localhost:3000/api/healthz
# { "ok": true }
Test POST:

bat
Copy code
curl -X POST http://localhost:3000/api/pastes -H "Content-Type: application/json" -d "{\"content\":\"Hello Aganitha\",\"ttl_seconds\":60,\"max_views\":3}"
Test GET:

bat
Copy code
curl http://localhost:3000/api/pastes/<PASTE_ID>
View in browser:

bash
Copy code
http://localhost:3000/p/<PASTE_ID>
TTL & Max Views Test
TTL: curl -H "x-test-now-ms: 9999999999999" http://localhost:3000/api/pastes/<PASTE_ID>

Max Views: After exceeding max_views, response:

json
Copy code
{"error":"View limit exceeded"}
Deployment (Vercel)
Push to GitHub:

bash
Copy code
git add .
git commit -m "Final version"
git push origin main
Import repo in Vercel → Add environment variables → Deploy

Live URL:

arduino
Copy code
https://pastebin-lite-weld.vercel.app
Quick test on Vercel (Windows CMD):

bat
Copy code
REM Create Paste
curl -X POST https://pastebin-lite-weld.vercel.app/api/pastes -H "Content-Type: application/json" -d "{\"content\":\"Hello Vercel\",\"ttl_seconds\":60,\"max_views\":3}"

REM Fetch Paste
curl https://pastebin-lite-weld.vercel.app/api/pastes/<PASTE_ID>

REM View in Browser
start https://pastebin-lite-weld.vercel.app/p/<PASTE_ID>
pgsql
