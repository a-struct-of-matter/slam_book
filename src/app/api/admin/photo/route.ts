import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/server/adminAuth";
import { getPhotoFromS3 } from "@/lib/server/s3Storage";

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

  try {
    const buf = await getPhotoFromS3(storageName);
    return new NextResponse(buf instanceof Buffer ? buf.buffer : buf, {
      headers: {
        "content-type": "application/octet-stream",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
