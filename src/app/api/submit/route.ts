import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  appendSubmission,
  getUploadsDir,
  type SlambookPhoto,
} from "@/lib/server/slambookStorage";

export const runtime = "nodejs";

function extFromMime(mime: string) {
  const m = mime.toLowerCase();
  if (m === "image/jpeg" || m === "image/jpg") return "jpg";
  if (m === "image/png") return "png";
  if (m === "image/webp") return "webp";
  if (m === "image/gif") return "gif";
  return "bin";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const rawPayload = form.get("payload");
    const photoFile = form.get("photo");

    if (typeof rawPayload !== "string" || rawPayload.trim().length === 0) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawPayload);
    } catch {
      return NextResponse.json(
        { error: "Invalid payload JSON" },
        { status: 400 },
      );
    }

    let photo: SlambookPhoto | undefined;
    if (photoFile instanceof File && photoFile.size > 0) {
      if (photoFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Photo too large (max 10MB)" },
          { status: 413 },
        );
      }
      const ext = extFromMime(photoFile.type || "");
      const storageName = `photo_${crypto.randomUUID()}.${ext}`;
      const uploadPath = path.join(getUploadsDir(), storageName);
      const buf = Buffer.from(await photoFile.arrayBuffer());
      await fs.writeFile(uploadPath, buf);
      photo = {
        storageName,
        originalName: photoFile.name || storageName,
        mimeType: photoFile.type || "application/octet-stream",
        size: photoFile.size,
      };
    }

    const saved = await appendSubmission({ payload, photo });
    return NextResponse.json({ ok: true, id: saved.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 },
    );
  }
}
