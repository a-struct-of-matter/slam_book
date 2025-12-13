import { NextResponse } from "next/server";
import {
  appendSubmission,
  type SlambookPhoto,
} from "@/lib/server/slambookStorage";
import { uploadPhotoToS3 } from "@/lib/server/s3Storage";

export const runtime = "nodejs";

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
      
      try {
        const buf = Buffer.from(await photoFile.arrayBuffer());
        const { storageName } = await uploadPhotoToS3(
          buf,
          photoFile.name || "photo",
          photoFile.type || "application/octet-stream",
        );
        photo = {
          storageName,
          originalName: photoFile.name || storageName,
          mimeType: photoFile.type || "application/octet-stream",
          size: photoFile.size,
        };
      } catch (uploadError) {
        console.error("Photo upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload photo to S3" },
          { status: 500 },
        );
      }
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
