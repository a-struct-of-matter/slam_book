import { NextResponse } from "next/server";
import { requireAdminKey } from "@/lib/server/adminAuth";
import { readAllSubmissions } from "@/lib/server/slambookStorage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = requireAdminKey(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const all = await readAllSubmissions();
  return NextResponse.json({ ok: true, submissions: all });
}
