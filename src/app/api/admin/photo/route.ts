import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/server/adminAuth";
import { getUploadsDir } from "@/lib/server/slambookStorage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = requireAdminKey(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const url = new URL(req.url);
  const storageName = url.searchParams.get("storageName");
  if (!storageName) {
    return NextResponse.json({ error: "Missing storageName" }, { status: 400 });
  }

  const filePath = path.join(getUploadsDir(), storageName);
  try {
    const buf = await fs.readFile(filePath);
    return new NextResponse(buf, {
      headers: {
        "content-type": "application/octet-stream",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
