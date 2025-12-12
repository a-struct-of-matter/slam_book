"use client";

import { useEffect, useMemo, useState } from "react";

type Submission = {
  id: string;
  createdAt: string;
  payload: unknown;
  photo?: {
    storageName: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
};

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Submission[]>([]);
  const [copied, setCopied] = useState<"idle" | "copied">("idle");

  const pretty = useMemo(() => JSON.stringify(rows, null, 2), [rows]);

  async function load() {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/admin/responses", {
        headers: {
          "x-admin-key": key,
        },
        cache: "no-store",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        submissions?: Submission[];
      };
      if (!res.ok || !data.ok) throw new Error(data.error || "Unauthorized");
      setRows(data.submissions || []);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    // convenience: allow passing ?key=... in URL
    const url = new URL(window.location.href);
    const k = url.searchParams.get("key");
    if (k) setKey(k);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-10 text-[var(--ink)]">
      <div className="mx-auto max-w-4xl">
        <div className="sb-paper sb-grid p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div
                className="sb-highlight"
                style={{ fontFamily: "var(--font-scribble)", fontSize: 22 }}
              >
                admin — responses
              </div>
              <div className="mt-2 text-sm text-neutral-600">
                This is intentionally simple: just fetch and show JSON you can
                copy.
              </div>
            </div>
            <a
              href="/"
              className="sb-scribble px-4 py-2 text-[14px] hover:bg-white/60"
              style={{ fontFamily: "var(--font-scribble)" }}
            >
              back to slambook
            </a>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <label>
              <div
                className="mb-1 text-[15px] text-neutral-800"
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                admin key
              </div>
              <input
                className="sb-scribble w-full px-3 py-2 text-[16px]"
                style={{ fontFamily: "var(--font-scribble)" }}
                placeholder="paste ADMIN_KEY"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <div className="mt-2 text-xs text-neutral-600">
                Generate a key (Bun):{" "}
                <span className="font-mono">
                  bun -e "console.log(crypto.randomUUID())"
                </span>
                <br />
                Then put it in <span className="font-mono">.env.local</span> as{" "}
                <span className="font-mono">ADMIN_KEY=...</span> and restart dev
                server.
              </div>
            </label>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={load}
                disabled={!key || status === "loading"}
                className={[
                  "sb-scribble px-5 py-2 text-[14px] focus-visible:ring-2 focus-visible:ring-black/20",
                  !key || status === "loading"
                    ? "opacity-70"
                    : "hover:bg-black hover:text-white",
                ].join(" ")}
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                {status === "loading" ? "loading..." : "load"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(pretty);
                    setCopied("copied");
                    setTimeout(() => setCopied("idle"), 1200);
                  } catch {
                    // ignore
                  }
                }}
                disabled={rows.length === 0}
                className={[
                  "sb-scribble px-5 py-2 text-[14px] focus-visible:ring-2 focus-visible:ring-black/20",
                  rows.length === 0 ? "opacity-70" : "hover:bg-white/70",
                ].join(" ")}
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                {copied === "copied" ? "copied!" : "copy json"}
              </button>
            </div>
          </div>

          {status === "error" ? (
            <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-red-700 shadow-sm">
              <span className="font-semibold">Oops:</span> {error}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/55 p-4">
              <div
                className="mb-2 sb-highlight sb-highlight--lemon"
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                quick list
              </div>
              <div className="grid gap-3">
                {rows.length === 0 ? (
                  <div className="text-sm text-neutral-600">
                    No submissions yet.
                  </div>
                ) : (
                  rows.map((r) => (
                    <div key={r.id} className="sb-scribble bg-white/50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="text-[15px]"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          {r.id}
                        </div>
                        <div className="text-xs text-neutral-600">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {r.photo ? (
                        <div className="mt-2 text-xs text-neutral-700">
                          photo:{" "}
                          <a
                            className="underline"
                            href={`/api/admin/photo?storageName=${encodeURIComponent(r.photo.storageName)}&key=${encodeURIComponent(
                              key,
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {r.photo.originalName}
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/55 p-4">
              <div
                className="mb-2 sb-highlight"
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                raw json (copy/paste)
              </div>
              <textarea
                readOnly
                className="sb-scribble h-[520px] w-full resize-none bg-white/50 px-3 py-2 font-mono text-[12px] leading-5"
                value={pretty}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
