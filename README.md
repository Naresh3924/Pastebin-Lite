# Pastebin Lite

A lightweight Pastebin application built with **Next.js (App Router)** and **Upstash Redis**, allowing users to create, fetch, and view temporary pastes with **TTL (Time-to-Live)** and **max view limits**.

---

## 📝 Features

- **Create Paste**: Users can submit text content with a TTL (in seconds) and a max number of views.  
- **Fetch Paste (API)**: Retrieve paste content in JSON format.  
- **View Paste (Browser)**: Display paste content as a plain HTML page.  
- **TTL Support**: Pastes expire automatically after the defined time.  
- **Max Views**: Pastes can only be viewed a limited number of times.  
- **Dynamic Routing**: Each paste has a unique URL with an ID.

---

## 📂 Folder Structure

pastebin-lite/
├─ app/
│ ├─ api/
│ │ ├─ pastes/
│ │ │ └─ route.ts ← POST handler
│ │ └─ pastes/
│ │ └─ [id]/
│ │ └─ route.ts ← GET handler
│ ├─ page.tsx
│ └─ layout.tsx
├─ lib/
│ ├─ redis.ts
│ └─ types.ts
├─ .env.local ← Environment variables
├─ package.json
├─ README.md

yaml
Copy code

---

## ⚙️ Environment Variables

Create a `.env.local` file in the **project root**:

UPSTASH_REDIS_REST_URL=<your_upstash_url>
UPSTASH_REDIS_REST_TOKEN=<your_upstash_token>
NEXT_PUBLIC_BASE_URL=http://localhost:3000

markdown
Copy code

> **Important:**  
> - No quotes  
> - One variable per line  
> - Restart server after changes  

In **Vercel production**, set `NEXT_PUBLIC_BASE_URL` to your live URL:

NEXT_PUBLIC_BASE_URL=https://pastebin-lite-weld.vercel.app

yaml
Copy code

---

## 🚀 How It Works

### 1️⃣ Create a Paste (POST)

**Endpoint:** `POST /api/pastes`  
**Body (JSON):**
```json
{
  "content": "Hello Aganitha",
  "ttl_seconds": 60,
  "max_views": 3
}
Response (JSON):

json
Copy code
{
  "id": "ca590ac7-afab-4c06-bae0-c1b99d1c0457",
  "url": "http://localhost:3000/p/ca590ac7-afab-4c06-bae0-c1b99d1c0457"
}
2️⃣ Fetch Paste (GET API)
Endpoint: GET /api/pastes/:id

Response (JSON):

json
Copy code
{
  "content": "Hello Aganitha",
  "remaining_views": 2,
  "expires_at": "2025-12-30T10:00:00.000Z"
}
TTL and max views are enforced.

3️⃣ View Paste in Browser
Endpoint: GET /p/:id

Displays paste content in plain HTML.

Refreshing counts as a view.

After max views or TTL expires → 404 page.

Example URL:

bash
Copy code
http://localhost:3000/p/ca590ac7-afab-4c06-bae0-c1b99d1c0457
🔧 Testing Locally
Install dependencies:

bash
Copy code
npm install
Run development server:

bash
Copy code
npm run dev
Health check:

bash
Copy code
http://localhost:3000/api/healthz
Expected response:

json
Copy code
{ "ok": true }
Test POST (Create Paste):

bat
Copy code
curl -X POST http://localhost:3000/api/pastes -H "Content-Type: application/json" -d "{\"content\":\"Hello Aganitha\",\"ttl_seconds\":60,\"max_views\":3}"
Test GET (Fetch Paste):

bat
Copy code
curl http://localhost:3000/api/pastes/<PASTE_ID>
View in browser:

bash
Copy code
http://localhost:3000/p/<PASTE_ID>
🧪 Testing TTL & Max Views
TTL Simulation: Use x-test-now-ms header to simulate time:

bat
Copy code
curl http://localhost:3000/api/pastes/<PASTE_ID> -H "x-test-now-ms: 9999999999999"
Max Views: Create a paste with max_views=2 → after 2 GET requests, the 3rd returns:

json
Copy code
{"error":"View limit exceeded"}
🔗 Deployment on Vercel
Push code to GitHub:

bash
Copy code
git add .
git commit -m "Pastebin Lite final version"
git push origin main
Import repository on Vercel.

Add environment variables:

nginx
Copy code
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_BASE_URL=https://pastebin-lite-weld.vercel.app
Deploy → Access live URL:

arduino
Copy code
https://pastebin-lite-weld.vercel.app
📖 Summary
Pastebin Lite allows users to create temporary text pastes with expiration and view limits.

Next.js App Router for API and dynamic pages

Upstash Redis for storing pastes

Dynamic routing [id] for unique paste URLs

Full JSON API + browser view support

🔧 Quick Test Commands for Vercel (Windows CMD)
bat
Copy code
REM Create Paste
curl -X POST https://pastebin-lite-weld.vercel.app/api/pastes -H "Content-Type: application/json" -d "{\"content\":\"Hello Vercel\",\"ttl_seconds\":60,\"max_views\":3}"

REM Fetch Paste (replace <PASTE_ID>)
curl https://pastebin-lite-weld.vercel.app/api/pastes/<PASTE_ID>

REM View Paste in Browser
start https://pastebin-lite-weld.vercel.app/p/<PASTE_ID>
✅ start command opens the URL in your default browser on Windows.