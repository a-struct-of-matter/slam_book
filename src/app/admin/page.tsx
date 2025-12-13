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
	"What's your cutest habit?",
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

function getQuestionLabel(idx: number): string {
	const keywords = [
		"Memory", "Nickname", "Habit", "Character", "Weird",
		"Smile", "Cute", "Vibe", "Fear", "Match",
		"Tiny", "Compliment", "Cook", "Try", "Superpower",
		"Surprise", "Gift", "Cheer", "Movie", "Feel",
		"Never"
	];
	return keywords[idx] || `Q${idx}`;
}

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
                  <div
                    key={r.id}
                    className="rounded-2xl bg-white/55 p-6 shadow-sm overflow-hidden"
                  >
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                      <div>
                        <div
                          className="sb-highlight text-lg"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          #{idx + 1} • {aboutMe?.name || "Anonymous"}
                        </div>
                        <div className="mt-1 text-xs text-neutral-600">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {r.photo && (
                        <a
                          className="sb-scribble sb-highlight--lemon px-3 py-1 text-xs hover:bg-white/20"
                          href={`/api/admin/photo?storageName=${encodeURIComponent(r.photo.storageName)}&key=${encodeURIComponent(
                            key,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📷 View Photo
                        </a>
                      )}
                    </div>

                    {/* Basic Info Grid */}
                    <div className="mb-4 grid gap-3 md:grid-cols-4">
                      <div className="rounded-lg bg-white/40 p-3">
                        <div className="text-xs text-neutral-600">Birthday</div>
                        <div
                          className="mt-1 text-sm font-semibold"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          {aboutMe?.birthday || "—"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/40 p-3">
                        <div className="text-xs text-neutral-600">Zodiac</div>
                        <div
                          className="mt-1 text-sm font-semibold"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          {aboutMe?.zodiac || "—"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/40 p-3">
                        <div className="text-xs text-neutral-600">
                          Current Place
                        </div>
                        <div
                          className="mt-1 text-sm font-semibold"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          {aboutMe?.currentPlace || "—"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/40 p-3">
                        <div className="text-xs text-neutral-600">
                          Now Playing
                        </div>
                        <div
                          className="mt-1 text-sm font-semibold"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          {aboutMe?.nowPlaying || "—"}
                        </div>
                      </div>
                    </div>

                    {/* Favorites Section */}
                    {Object.values(favs).some((v) => v) && (
                      <div className="mb-4">
                        <div
                          className="mb-2 sb-highlight sb-highlight--peach text-sm"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          Favorites
                        </div>
                        <div className="grid gap-2 md:grid-cols-5">
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
                          ].map((item) => (
                            favs[item.key] && (
                              <div
                                key={item.key}
                                className="rounded-lg bg-white/40 p-2"
                              >
                                <div className="text-xs text-neutral-600">
                                  {item.label}
                                </div>
                                <div className="mt-1 text-sm truncate">
                                  {favs[item.key]}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lists Section */}
                    <div className="mb-4 grid gap-4 md:grid-cols-3">
                      {aboutMe?.hobbies?.some((h: string) => h) && (
                        <div>
                          <div
                            className="mb-2 sb-highlight--lemon text-xs"
                            style={{ fontFamily: "var(--font-scribble)" }}
                          >
                            Hobbies
                          </div>
                          <div className="space-y-1">
                            {aboutMe.hobbies.map((h: string, i: number) =>
                              h ? (
                                <div
                                  key={i}
                                  className="rounded bg-white/40 px-2 py-1 text-sm"
                                >
                                  {h}
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      )}
                      {aboutMe?.habits?.some((h: string) => h) && (
                        <div>
                          <div
                            className="mb-2 sb-highlight--peach text-xs"
                            style={{ fontFamily: "var(--font-scribble)" }}
                          >
                            Habits
                          </div>
                          <div className="space-y-1">
                            {aboutMe.habits.map((h: string, i: number) =>
                              h ? (
                                <div
                                  key={i}
                                  className="rounded bg-white/40 px-2 py-1 text-sm"
                                >
                                  {h}
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      )}
                      {aboutMe?.quirks?.some((q: string) => q) && (
                        <div>
                          <div
                            className="mb-2 sb-highlight--lemon text-xs"
                            style={{ fontFamily: "var(--font-scribble)" }}
                          >
                            Quirks
                          </div>
                          <div className="space-y-1">
                            {aboutMe.quirks.map((q: string, i: number) =>
                              q ? (
                                <div
                                  key={i}
                                  className="rounded bg-white/40 px-2 py-1 text-sm"
                                >
                                  {q}
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Text Areas */}
                    <div className="mb-4 grid gap-4 md:grid-cols-2">
                      {aboutMe?.interests && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div
                            className="mb-2 text-xs font-semibold text-neutral-700"
                            style={{ fontFamily: "var(--font-scribble)" }}
                          >
                            Interests
                          </div>
                          <div className="text-sm text-neutral-800 whitespace-pre-wrap">
                            {aboutMe.interests}
                          </div>
                        </div>
                      )}
                      {aboutMe?.bucketList && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div
                            className="mb-2 text-xs font-semibold text-neutral-700"
                            style={{ fontFamily: "var(--font-scribble)" }}
                          >
                            Bucket List
                          </div>
                          <div className="text-sm text-neutral-800 whitespace-pre-wrap">
                            {aboutMe.bucketList}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Short Messages */}
                    <div className="mb-4 grid gap-3 md:grid-cols-3">
                      {aboutMe?.motto && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="text-xs text-neutral-600">Motto</div>
                          <div className="mt-1 text-sm italic text-neutral-800">
                            "{aboutMe.motto}"
                          </div>
                        </div>
                      )}
                      {aboutMe?.bestQuality && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="text-xs text-neutral-600">
                            Best Quality
                          </div>
                          <div className="mt-1 text-sm text-neutral-800">
                            {aboutMe.bestQuality}
                          </div>
                        </div>
                      )}
                      {aboutMe?.secretTalent && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="text-xs text-neutral-600">
                            Secret Talent
                          </div>
                          <div className="mt-1 text-sm text-neutral-800">
                            {aboutMe.secretTalent}
                          </div>
                        </div>
                      )}
                      {aboutMe?.futureJob && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="text-xs text-neutral-600">
                            Dream Job
                          </div>
                          <div className="mt-1 text-sm text-neutral-800">
                            {aboutMe.futureJob}
                          </div>
                        </div>
                      )}
                      {aboutMe?.dreamDestination && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="text-xs text-neutral-600">
                            Dream Destination
                          </div>
                          <div className="mt-1 text-sm text-neutral-800">
                            {aboutMe.dreamDestination}
                          </div>
                        </div>
                      )}
                      {aboutMe?.messageToSelf && (
                        <div className="rounded-lg bg-white/40 p-3">
                          <div className="text-xs text-neutral-600">
                            Message to Self
                          </div>
                          <div className="mt-1 text-sm italic text-neutral-800">
                            "{aboutMe.messageToSelf}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Questions */}
                    {aboutMe?.qa &&
                      Object.values(aboutMe.qa).some((v) => v) && (
                        <div className="mb-4">
                          <div
                            className="mb-3 sb-highlight sb-highlight--lemon text-sm"
                            style={{ fontFamily: "var(--font-scribble)" }}
                          >
                            Quick Answers
                          </div>
                          <div className="space-y-3 text-sm">
                            {Object.entries(aboutMe.qa).map(([key, val]: [string, any]) => {
                              const qIdx = parseInt(key.replace("q", ""));
                              const label = getQuestionLabel(qIdx);
                              return val ? (
                                <div
                                  key={key}
                                  className="rounded-lg bg-white/40 p-3 border-l-2 border-neutral-300"
                                >
                                  <div className="mb-1 text-xs font-semibold text-neutral-700">
                                    {label}
                                  </div>
                                  <div className="text-neutral-800">
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
                        <div
                          className="mb-2 text-xs font-semibold text-neutral-700"
                          style={{ fontFamily: "var(--font-scribble)" }}
                        >
                          Fun Facts
                        </div>
                        <div className="text-sm text-neutral-800 whitespace-pre-wrap">
                          {aboutMe.funFacts}
                        </div>
                      </div>
                    )}

                    {/* Raw JSON Toggle */}
                    <details className="mt-4 pt-4 border-t border-neutral-200">
                      <summary className="cursor-pointer text-xs font-semibold text-neutral-600 hover:text-neutral-800">
                        View Raw JSON
                      </summary>
                      <textarea
                        readOnly
                        className="sb-scribble mt-3 h-[200px] w-full resize-none bg-white/50 px-3 py-2 font-mono text-[11px] leading-4"
                        value={JSON.stringify(payload, null, 2)}
                      />
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
