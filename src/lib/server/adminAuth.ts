export function requireAdminKey(
  req: Request,
): { ok: true } | { ok: false; status: number; message: string } {
  const configured = process.env.ADMIN_KEY;
  if (!configured) {
    return { ok: false, status: 500, message: "ADMIN_KEY is not configured" };
  }

  const url = new URL(req.url);
  const key =
    req.headers.get("x-admin-key") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    url.searchParams.get("key");

  if (!key || key !== configured) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  return { ok: true };
}
