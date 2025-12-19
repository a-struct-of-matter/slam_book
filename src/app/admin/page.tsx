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

const QUESTIONS = [
  "What's one memory you have that always makes you smile?",
  "Give yourself a silly nickname you think actually fits.",
  "What habit of yours would you 'upgrade' if you had the power?",
  "Which cartoon character do you think you act like sometimes?",
  "What's the weirdest thing you do that cracks you up?",
  "What little thing other do that makes you smile without realizing?",
  "Who's your favorite crush off all time?",
  "How would you describe your vibe in a few words?",
  "Which of your fears do you find a little silly?",
  "What book or movie matches your personality?",
  "What's a tiny thing you do that reminds you of a good day?",
  "Give yourself a compliment you actually mean.",
  "What would you make for yourself on a cozy Sunday?",
  "What new thing do you want to try this year?",
  "What's a secret 'superpower' you think you have?",
  "What hobby of yours would surprise people if they knew?",
  "What small gift would make your day?",
  "How would you cheer yourself up on a rough day?",
  "Which movie do you always end up talking over?",
  "What's your favorite way to make yourself feel good?",
  "What's one thing you'd never want to change about yourself?",
];

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
        headers: { "x-admin-key": key },
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
    const url = new URL(window.location.href);
    const k = url.searchParams.get("key");
    if (k) setKey(k);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-10 text-[var(--ink)]">
      <div className="mx-auto max-w-4xl">
        <div className="sb-paper sb-grid p-6 md:p-8">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="sb-highlight" style={{ fontFamily: "var(--font-scribble)", fontSize: 22 }}>
                admin — responses
              </div>
              <div className="mt-2 text-sm text-neutral-600">
                Full view of all submitted entries.
              </div>
            </div>
            <a href="/" className="sb-scribble px-4 py-2 text-[14px] hover:bg-white/60" style={{ fontFamily: "var(--font-scribble)" }}>
              back to slambook
            </a>
          </div>

          {/* Controls */}
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <label>
              <div className="mb-1 text-[15px] text-neutral-800" style={{ fontFamily: "var(--font-scribble)" }}>
                admin key
              </div>
              <input
                className="sb-scribble w-full px-3 py-2 text-[16px]"
                style={{ fontFamily: "var(--font-scribble)" }}
                placeholder="paste ADMIN_KEY"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </label>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={load}
                disabled={!key || status === "loading"}
                className={`sb-scribble px-5 py-2 text-[14px] ${!key || status === "loading" ? "opacity-70" : "hover:bg-black hover:text-white"}`}
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                {status === "loading" ? "loading..." : "load"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(pretty);
                  setCopied("copied");
                  setTimeout(() => setCopied("idle"), 1200);
                }}
                disabled={rows.length === 0}
                className={`sb-scribble px-5 py-2 text-[14px] ${rows.length === 0 ? "opacity-70" : "hover:bg-white/70"}`}
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                {copied === "copied" ? "copied!" : "copy json"}
              </button>
            </div>
          </div>

          {status === "error" && (
            <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-red-700 shadow-sm">
              <span className="font-semibold">Oops:</span> {error}
            </div>
          )}

          <div className="mt-5 grid gap-4">
            {rows.length === 0 ? (
              <div className="rounded-2xl bg-white/55 p-8 text-center text-neutral-600">
                No submissions yet.
              </div>
            ) : (
              rows.map((r, idx) => {
                const payload = r.payload as any;
                const aboutMe = payload?.aboutMe || {};
                const favs = aboutMe?.favorites || {};

                return (
                  <div key={r.id} className="rounded-2xl bg-white/55 p-6 shadow-sm overflow-hidden">
                    {/* Entry Header */}
                    <div className="mb-4 flex items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                      <div>
                        <div className="sb-highlight text-lg" style={{ fontFamily: "var(--font-scribble)" }}>
                          #{idx + 1} • {aboutMe?.name || "Anonymous"}
                        </div>
                        <div className="mt-1 text-xs text-neutral-600">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {r.photo && (
                        <a
                          className="sb-scribble sb-highlight--lemon px-3 py-1 text-xs hover:bg-white/20"
                          href={`/api/admin/photo?storageName=${encodeURIComponent(r.photo.storageName)}&key=${encodeURIComponent(key)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📷 View Photo
                        </a>
                      )}
                    </div>

                    {/* Info Grid - Changed to 2 columns on mobile to prevent squishing */}
                    <div className="mb-4 grid gap-3 grid-cols-2 md:grid-cols-4">
                      {[
                        { label: "Birthday", val: aboutMe?.birthday },
                        { label: "Zodiac", val: aboutMe?.zodiac },
                        { label: "Current Place", val: aboutMe?.currentPlace },
                        { label: "Now Playing", val: aboutMe?.nowPlaying },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg bg-white/40 p-3">
                          <div className="text-xs text-neutral-600">{item.label}</div>
                          <div className="mt-1 text-sm font-semibold break-words" style={{ fontFamily: "var(--font-scribble)" }}>
                            {item.val || "—"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Favorites Section - FIXED: Removed truncate, added wrap */}
                    {Object.values(favs).some((v) => v) && (
                      <div className="mb-4">
                        <div className="mb-2 sb-highlight sb-highlight--peach text-sm" style={{ fontFamily: "var(--font-scribble)" }}>
                          Favorites
                        </div>
                        <div className="grid gap-2 grid-cols-2 md:grid-cols-5">
                          {[
                            { key: "food", label: "Food" },
                            { key: "animal", label: "Animal" },
                            { key: "place", label: "Place" },
                            { key: "movie", label: "Movie/Show" },
                            { key: "color", label: "Color" },
                            { key: "song", label: "Song" },
                            { key: "book", label: "Book" },
                            { key: "app", label: "App" },
                            { key: "holiday", label: "Holiday" },
                            { key: "vlogger", label: "Creator" },
                          ].map(
                            (item) =>
                              favs[item.key] && (
                                <div key={item.key} className="rounded-lg bg-white/40 p-2">
                                  <div className="text-xs text-neutral-600">{item.label}</div>
                                  <div className="mt-1 text-sm whitespace-pre-wrap break-words">
                                    {favs[item.key]}
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Multi-line fields */}
                    <div className="mb-4 grid gap-4 md:grid-cols-2">
                      {aboutMe?.interests && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="mb-2 text-xs font-semibold text-neutral-700" style={{ fontFamily: "var(--font-scribble)" }}>Interests</div>
                          <div className="text-sm text-neutral-800 whitespace-pre-wrap break-words">{aboutMe.interests}</div>
                        </div>
                      )}
                      {aboutMe?.bucketList && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="mb-2 text-xs font-semibold text-neutral-700" style={{ fontFamily: "var(--font-scribble)" }}>Bucket List</div>
                          <div className="text-sm text-neutral-800 whitespace-pre-wrap break-words">{aboutMe.bucketList}</div>
                        </div>
                      )}
                    </div>

                    {/* Quick Answers Section - FIXED: Ensures questions and answers wrap */}
                    {aboutMe?.qa && Object.values(aboutMe.qa).some((v) => v) && (
                      <div className="mb-4">
                        <div className="mb-3 sb-highlight sb-highlight--lemon text-sm" style={{ fontFamily: "var(--font-scribble)" }}>
                          Quick Answers
                        </div>
                        <div className="space-y-4">
                          {Object.entries(aboutMe.qa).map(([key, val]: [string, any]) => {
                            const qIdx = parseInt(key.replace("q", ""));
                            const fullQuestion = QUESTIONS[qIdx] || `Question ${qIdx + 1}`;
                            return val ? (
                              <div key={key} className="rounded-lg bg-white/40 p-4 border-l-4 border-neutral-300">
                                <div className="mb-2 text-sm text-neutral-900 leading-snug break-words" style={{ fontFamily: "var(--font-scribble)" }}>
                                  {fullQuestion}
                                </div>
                                <div className="text-sm text-neutral-800 bg-white/40 p-2 rounded whitespace-pre-wrap break-words">
                                  {val}
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fun Facts */}
                    {aboutMe?.funFacts && (
                      <div className="rounded-lg bg-white/40 p-3">
                        <div className="mb-2 text-xs font-semibold text-neutral-700" style={{ fontFamily: "var(--font-scribble)" }}>Fun Facts</div>
                        <div className="text-sm text-neutral-800 whitespace-pre-wrap break-words">{aboutMe.funFacts}</div>
                      </div>
                    )}

                    <details className="mt-4 pt-4 border-t border-neutral-200">
                      <summary className="cursor-pointer text-xs font-semibold text-neutral-600 hover:text-neutral-800">View Raw JSON</summary>
                      <textarea readOnly className="sb-scribble mt-3 h-[150px] w-full resize-none bg-white/50 px-3 py-2 font-mono text-[11px]" value={JSON.stringify(payload, null, 2)} />
                    </details>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}