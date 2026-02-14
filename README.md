-This project is entirely made using AI
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Bun-first setup

- Install deps:

```bash
bun install
```

- Run the dev server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## ADMIN_KEY Setup (for viewing responses)

### Step 1: Generate your ADMIN_KEY

Run this command to generate a secure random key:

```bash
bun -e "console.log(crypto.randomUUID())"
```

Copy the output (it looks like `a1b2c3d4-e5f6-...`).

### Step 2: Save it locally (for development)

Create a `.env.local` file in the repo root and paste your key:

```bash
echo "ADMIN_KEY=PASTE_YOUR_UUID_HERE" > .env.local
```

**Restart the dev server** (`bun dev`) after creating this file.

### Step 3: Set it in production

When deploying, set `ADMIN_KEY` as an **environment variable on your host**:

- **Vercel**: Project Settings → Environment Variables → add `ADMIN_KEY`
- **Render**: Environment tab → add `ADMIN_KEY`
- **Railway/Fly/other**: follow their env var setup docs

**Important**: Do NOT commit `.env.local` or share your `ADMIN_KEY` with anyone.

---

## Storage / "backend"

- Submissions are stored locally in `data/submissions.json` (human-readable).
- Uploaded photos are stored in `data/uploads/`.

---

## How to read responses

### Your friend (submitting)
1. Opens the public slambook link (e.g., `https://your-app.com`)
2. Fills out the slambook
3. Clicks **send**
4. ✅ Done (they **never** need the `ADMIN_KEY`)

### You (reading responses)
1. Open `/admin` (e.g., `https://your-app.com/admin`)
2. Paste your `ADMIN_KEY` in the input
3. Click **Load**
4. You'll see:
   - A **quick list** of all submissions
   - **Raw JSON** you can copy/export
   - Photos are downloadable

**Alternative**: Open `data/submissions.json` directly on your server.

---

## Production storage notes

Right now responses are saved to the server filesystem (`data/submissions.json` + `data/uploads/`).

**This requires a host with persistent disk:**

- ✅ **Works on**: VPS, Render Disk, Railway volumes, Fly.io volumes, self-hosted
- ⚠️ **Does NOT work on**: Vercel/Netlify (serverless = ephemeral filesystem)

**If deploying to Vercel/serverless**: let me know and I'll switch storage to a tiny durable solution (e.g., Vercel Blob + KV, or Turso). The code will stay simple.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
