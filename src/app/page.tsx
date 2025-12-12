"use client";

import { useMemo, useState } from "react";
import {
  CameraDoodle,
  HeartDoodle,
  SparkleDoodle,
} from "@/components/slambook/Doodles";
import {
  ScribbleArea,
  ScribbleField,
} from "@/components/slambook/ScribbleField";

type SlamPayload = {
  aboutMe: {
    name: string;
    birthday: string;
    currentPlace: string;
    zodiac: string;
    favorites: {
      food: string;
      animal: string;
      place: string;
      movie: string;
      app: string;
      holiday: string;
      vlogger: string;
    };
    hobbies: string[];
    habits: string[];
    interests: string;
    bucketList: string;
    nowPlaying: string;
    motto: string;
    funFacts: string;
  };
  friendships: {
    howWell: string;
    knownHowLong: string;
    whereMet: string;
    favoriteSnack: string;
    remindsAnimal: string;
    music: string;
    hateGame: string;
    firstPhotoCaption: string;
    friendsFor: string;
    message: string;
    hateAboutMe: string[];
    placesVisited: string[];
    wouldRather: {
      catDog: "cat" | "dog" | "";
      cookClean: "cook" | "clean" | "";
      onlineStore: "online" | "store" | "";
      introExtro: "introvert" | "extrovert" | "";
      bathShower: "bath" | "shower" | "";
      athleticCreative: "athletic" | "creative" | "";
      flowersChocolates: "flowers" | "chocolates" | "";
    };
    doneTogether: Record<string, boolean>;
  };
};

const doneTogetherOptions = [
  ["sleepover", "had a sleepover"],
  ["movies", "watched movies"],
  ["matching", "wore matching outfits"],
  ["camping", "went camping together"],
  ["makeup", "done each other’s makeup"],
  ["crush", "helped with a crush"],
  ["photoshoot", "had a photoshoot"],
  ["nightDrive", "dance + night drive together"],
  ["secret", "told your deepest secret"],
  ["insideJokes", "made inside jokes"],
  ["clothes", "shared each other clothes"],
] as const;

function PillChoice({
  label,
  choices,
  value,
  onChange,
}: {
  label: string;
  choices: readonly [string, string];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div
        className="text-[15px] text-neutral-800"
        style={{ fontFamily: "var(--font-scribble)" }}
      >
        {label}
      </div>
      <div className="flex items-center gap-2">
        {choices.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(active ? "" : opt)}
              aria-pressed={active}
              className={[
                "relative px-3 py-1.5 text-[14px] sb-scribble",
                "transition-colors focus-visible:ring-2 focus-visible:ring-black/20",
                active
                  ? "!bg-black !text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
                  : "bg-white/40 text-neutral-900 hover:bg-white/60",
              ].join(" ")}
              style={{ fontFamily: "var(--font-scribble)" }}
            >
              <span className="inline-flex items-center gap-1.5">
                {active ? (
                  <span
                    aria-hidden="true"
                    className="grid h-5 w-5 place-items-center rounded-full bg-white text-[12px] font-bold text-black shadow"
                  >
                    ✓
                  </span>
                ) : null}
                <span>{opt}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TypedPillChoice<const T extends string>({
  label,
  choices,
  value,
  onChange,
}: {
  label: string;
  choices: readonly [T, T];
  value: T | "";
  onChange: (v: T | "") => void;
}) {
  return (
    <PillChoice
      label={label}
      choices={choices}
      value={value}
      onChange={(v) =>
        onChange((v === choices[0] || v === choices[1] ? v : "") as T | "")
      }
    />
  );
}

export default function Home() {
  const initial = useMemo<SlamPayload>(
    () => ({
      aboutMe: {
        name: "",
        birthday: "",
        currentPlace: "",
        zodiac: "",
        favorites: {
          food: "",
          animal: "",
          place: "",
          movie: "",
          app: "",
          holiday: "",
          vlogger: "",
        },
        hobbies: ["", "", "", "", ""],
        habits: ["", "", "", "", ""],
        interests: "",
        bucketList: "",
        nowPlaying: "",
        motto: "",
        funFacts: "",
      },
      friendships: {
        howWell: "",
        knownHowLong: "",
        whereMet: "",
        favoriteSnack: "",
        remindsAnimal: "",
        music: "",
        hateGame: "",
        firstPhotoCaption: "",
        friendsFor: "",
        message: "",
        hateAboutMe: ["", "", ""],
        placesVisited: ["", "", ""],
        wouldRather: {
          catDog: "",
          cookClean: "",
          onlineStore: "",
          introExtro: "",
          bathShower: "",
          athleticCreative: "",
          flowersChocolates: "",
        },
        doneTogether: Object.fromEntries(
          doneTogetherOptions.map(([k]) => [k, false]),
        ),
      },
    }),
    [],
  );

  const [photo, setPhoto] = useState<File | null>(null);
  const [slam, setSlam] = useState<SlamPayload>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState<string>("");

  async function submit() {
    setStatus("saving");
    setError("");
    try {
      const fd = new FormData();
      fd.set("payload", JSON.stringify(slam));
      if (photo) fd.set("photo", photo);
      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit");
      }
      setStatus("saved");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed to submit");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-10 text-[var(--ink)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2">
              <span
                className="sb-highlight"
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                slambook
              </span>
              <span
                className="sb-highlight sb-highlight--lemon"
                style={{ fontFamily: "var(--font-scribble)" }}
              >
                for friends only
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSlam(initial);
                setPhoto(null);
                setStatus("idle");
                setError("");
              }}
              className="sb-scribble px-4 py-2 text-[14px] hover:bg-white/60"
              style={{ fontFamily: "var(--font-scribble)" }}
            >
              reset
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={status === "saving"}
              className={[
                "sb-scribble px-5 py-2 text-[14px]",
                status === "saving"
                  ? "opacity-70"
                  : "hover:bg-black hover:text-white",
              ].join(" ")}
              style={{ fontFamily: "var(--font-scribble)" }}
            >
              {status === "saving" ? "saving..." : "send 💌"}
            </button>
          </div>
        </div>

        {status === "saved" ? (
          <div className="mb-6 rounded-2xl bg-white/70 px-4 py-3 text-sm text-neutral-800 shadow-sm">
            <span
              className="sb-highlight sb-highlight--peach"
              style={{ fontFamily: "var(--font-scribble)" }}
            >
              saved!
            </span>{" "}
            I’ve tucked this into your slambook. You can reset and fill again.
          </div>
        ) : null}

        {status === "error" ? (
          <div className="mb-6 rounded-2xl bg-white/70 px-4 py-3 text-sm text-red-700 shadow-sm">
            <span className="font-semibold">Oops:</span> {error}
          </div>
        ) : null}

        <div className="sb-paper sb-grid relative overflow-hidden p-6 md:p-8">
          <HeartDoodle className="sb-doodle left-6 top-6 h-14 w-14 -rotate-12" />
          <SparkleDoodle className="sb-doodle right-10 top-10 h-12 w-12 rotate-6" />
          <CameraDoodle className="sb-doodle right-6 bottom-6 h-14 w-14 rotate-6 opacity-80" />

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* left page: friendships */}
            <section className="relative rounded-2xl bg-white/55 p-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="sb-highlight"
                  style={{ fontFamily: "var(--font-scribble)", fontSize: 22 }}
                >
                  about your friendships
                </div>
                <div
                  className="sb-highlight sb-highlight--peach"
                  style={{ fontFamily: "var(--font-scribble)" }}
                >
                  how well do you know me?
                </div>
              </div>

              <div className="grid gap-3">
                <ScribbleField
                  label="how long have you known me?"
                  value={slam.friendships.knownHowLong}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      friendships: { ...s.friendships, knownHowLong: v },
                    }))
                  }
                />
                <ScribbleField
                  label="where did we meet?"
                  value={slam.friendships.whereMet}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      friendships: { ...s.friendships, whereMet: v },
                    }))
                  }
                />
                <ScribbleField
                  label="what is my favorite snack?"
                  value={slam.friendships.favoriteSnack}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      friendships: { ...s.friendships, favoriteSnack: v },
                    }))
                  }
                />
                <ScribbleField
                  label="what animal do I remind you of?"
                  value={slam.friendships.remindsAnimal}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      friendships: { ...s.friendships, remindsAnimal: v },
                    }))
                  }
                />
                <ScribbleField
                  label="what type of music do I like best?"
                  value={slam.friendships.music}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      friendships: { ...s.friendships, music: v },
                    }))
                  }
                />
                <ScribbleField
                  label="what game do I hate to play?"
                  value={slam.friendships.hateGame}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      friendships: { ...s.friendships, hateGame: v },
                    }))
                  }
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/45 p-4">
                  <div
                    className="mb-2 sb-highlight sb-highlight--lemon"
                    style={{ fontFamily: "var(--font-scribble)" }}
                  >
                    our 1st photo together
                  </div>
                  <label className="block">
                    <div className="sb-scribble grid aspect-[4/3] place-items-center px-4 text-center text-sm text-neutral-700">
                      <div>
                        <div style={{ fontFamily: "var(--font-scribble)" }}>
                          drop a photo
                        </div>
                        <div className="mt-2 text-xs text-neutral-600">
                          jpg / png / webp • max 10MB
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-2 block w-full text-sm"
                      onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <ScribbleField
                    className="mt-3"
                    label="caption?"
                    value={slam.friendships.firstPhotoCaption}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: { ...s.friendships, firstPhotoCaption: v },
                      }))
                    }
                  />
                </div>

                <div className="rounded-2xl bg-white/45 p-4">
                  <div
                    className="mb-2 sb-highlight"
                    style={{ fontFamily: "var(--font-scribble)" }}
                  >
                    we’ve been friends for...
                  </div>
                  <ScribbleField
                    placeholder="months / years"
                    value={slam.friendships.friendsFor}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: { ...s.friendships, friendsFor: v },
                      }))
                    }
                  />

                  <ScribbleArea
                    className="mt-4"
                    label="just write a short message about me"
                    rows={5}
                    value={slam.friendships.message}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: { ...s.friendships, message: v },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/45 p-4">
                  <div
                    className="mb-2 sb-highlight sb-highlight--lemon"
                    style={{ fontFamily: "var(--font-scribble)" }}
                  >
                    things you hate about me
                  </div>
                  <div className="grid gap-2">
                    {slam.friendships.hateAboutMe.map((v, idx) => (
                      <ScribbleField
                        key={`hate-${idx + 1}`}
                        placeholder="(be nice 😭)"
                        value={v}
                        onChange={(nv) =>
                          setSlam((s) => {
                            const next = [...s.friendships.hateAboutMe];
                            next[idx] = nv;
                            return {
                              ...s,
                              friendships: {
                                ...s.friendships,
                                hateAboutMe: next,
                              },
                            };
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/45 p-4">
                  <div
                    className="mb-2 sb-highlight sb-highlight--lemon"
                    style={{ fontFamily: "var(--font-scribble)" }}
                  >
                    places we visit together
                  </div>
                  <div className="grid gap-2">
                    {slam.friendships.placesVisited.map((v, idx) => (
                      <ScribbleField
                        key={`place-${idx + 1}`}
                        placeholder="place"
                        value={v}
                        onChange={(nv) =>
                          setSlam((s) => {
                            const next = [...s.friendships.placesVisited];
                            next[idx] = nv;
                            return {
                              ...s,
                              friendships: {
                                ...s.friendships,
                                placesVisited: next,
                              },
                            };
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/45 p-4">
                <div
                  className="mb-3 sb-highlight"
                  style={{ fontFamily: "var(--font-scribble)" }}
                >
                  how many have we done together?
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {doneTogetherOptions.map(([key, label]) => {
                    const checked = !!slam.friendships.doneTogether[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setSlam((s) => ({
                            ...s,
                            friendships: {
                              ...s.friendships,
                              doneTogether: {
                                ...s.friendships.doneTogether,
                                [key]: !checked,
                              },
                            },
                          }))
                        }
                        aria-pressed={checked}
                        className={[
                          "relative sb-scribble px-3 py-3 pr-9 text-left text-[14px] leading-5",
                          "focus-visible:ring-2 focus-visible:ring-black/20",
                          checked
                            ? "!bg-black !text-white shadow-[0_10px_22px_rgba(0,0,0,0.18)]"
                            : "bg-white/45 hover:bg-white/65",
                        ].join(" ")}
                        style={{ fontFamily: "var(--font-scribble)" }}
                      >
                        {label}
                        {checked ? (
                          <span
                            aria-hidden="true"
                            className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-white text-[12px] font-bold text-black shadow"
                          >
                            ✓
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/45 p-4">
                <div
                  className="mb-3 sb-highlight sb-highlight--peach"
                  style={{ fontFamily: "var(--font-scribble)" }}
                >
                  would I rather?
                </div>
                <div className="grid gap-3">
                  <TypedPillChoice
                    label="cat / dog"
                    choices={["cat", "dog"] as const}
                    value={slam.friendships.wouldRather.catDog}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: {
                          ...s.friendships,
                          wouldRather: {
                            ...s.friendships.wouldRather,
                            catDog: v,
                          },
                        },
                      }))
                    }
                  />
                  <TypedPillChoice
                    label="cook / clean"
                    choices={["cook", "clean"] as const}
                    value={slam.friendships.wouldRather.cookClean}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: {
                          ...s.friendships,
                          wouldRather: {
                            ...s.friendships.wouldRather,
                            cookClean: v,
                          },
                        },
                      }))
                    }
                  />
                  <TypedPillChoice
                    label="shop online / shop in store"
                    choices={["online", "store"] as const}
                    value={slam.friendships.wouldRather.onlineStore}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: {
                          ...s.friendships,
                          wouldRather: {
                            ...s.friendships.wouldRather,
                            onlineStore: v,
                          },
                        },
                      }))
                    }
                  />
                  <TypedPillChoice
                    label="introvert / extrovert"
                    choices={["introvert", "extrovert"] as const}
                    value={slam.friendships.wouldRather.introExtro}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: {
                          ...s.friendships,
                          wouldRather: {
                            ...s.friendships.wouldRather,
                            introExtro: v,
                          },
                        },
                      }))
                    }
                  />
                  <TypedPillChoice
                    label="bath / shower"
                    choices={["bath", "shower"] as const}
                    value={slam.friendships.wouldRather.bathShower}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: {
                          ...s.friendships,
                          wouldRather: {
                            ...s.friendships.wouldRather,
                            bathShower: v,
                          },
                        },
                      }))
                    }
                  />
                  <TypedPillChoice
                    label="athletic / creative"
                    choices={["athletic", "creative"] as const}
                    value={slam.friendships.wouldRather.athleticCreative}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: {
                          ...s.friendships,
                          wouldRather: {
                            ...s.friendships.wouldRather,
                            athleticCreative: v,
                          },
                        },
                      }))
                    }
                  />
                  <TypedPillChoice
                    label="flowers / chocolates"
                    choices={["flowers", "chocolates"] as const}
                    value={slam.friendships.wouldRather.flowersChocolates}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        friendships: {
                          ...s.friendships,
                          wouldRather: {
                            ...s.friendships.wouldRather,
                            flowersChocolates: v,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </section>

            {/* right page: about me */}
            <section className="relative rounded-2xl bg-white/55 p-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="sb-highlight"
                  style={{ fontFamily: "var(--font-scribble)", fontSize: 22 }}
                >
                  about me
                </div>
                <div
                  className="sb-highlight sb-highlight--lemon"
                  style={{ fontFamily: "var(--font-scribble)" }}
                >
                  current favorites
                </div>
              </div>

              <div className="grid gap-3">
                <ScribbleField
                  label="name / nickname"
                  value={slam.aboutMe.name}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      aboutMe: { ...s.aboutMe, name: v },
                    }))
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <ScribbleField
                    label="birthday"
                    value={slam.aboutMe.birthday}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        aboutMe: { ...s.aboutMe, birthday: v },
                      }))
                    }
                  />
                  <ScribbleField
                    label="zodiac sign"
                    value={slam.aboutMe.zodiac}
                    onChange={(v) =>
                      setSlam((s) => ({
                        ...s,
                        aboutMe: { ...s.aboutMe, zodiac: v },
                      }))
                    }
                  />
                </div>
                <ScribbleField
                  label="current place"
                  value={slam.aboutMe.currentPlace}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      aboutMe: { ...s.aboutMe, currentPlace: v },
                    }))
                  }
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/45 p-4">
                  <div
                    className="mb-2 sb-highlight sb-highlight--peach"
                    style={{ fontFamily: "var(--font-scribble)" }}
                  >
                    current favorites
                  </div>
                  <div className="grid gap-2">
                    <ScribbleField
                      label="food"
                      value={slam.aboutMe.favorites.food}
                      onChange={(v) =>
                        setSlam((s) => ({
                          ...s,
                          aboutMe: {
                            ...s.aboutMe,
                            favorites: { ...s.aboutMe.favorites, food: v },
                          },
                        }))
                      }
                    />
                    <ScribbleField
                      label="animal"
                      value={slam.aboutMe.favorites.animal}
                      onChange={(v) =>
                        setSlam((s) => ({
                          ...s,
                          aboutMe: {
                            ...s.aboutMe,
                            favorites: { ...s.aboutMe.favorites, animal: v },
                          },
                        }))
                      }
                    />
                    <ScribbleField
                      label="place"
                      value={slam.aboutMe.favorites.place}
                      onChange={(v) =>
                        setSlam((s) => ({
                          ...s,
                          aboutMe: {
                            ...s.aboutMe,
                            favorites: { ...s.aboutMe.favorites, place: v },
                          },
                        }))
                      }
                    />
                    <ScribbleField
                      label="movie"
                      value={slam.aboutMe.favorites.movie}
                      onChange={(v) =>
                        setSlam((s) => ({
                          ...s,
                          aboutMe: {
                            ...s.aboutMe,
                            favorites: { ...s.aboutMe.favorites, movie: v },
                          },
                        }))
                      }
                    />
                    <ScribbleField
                      label="app / website"
                      value={slam.aboutMe.favorites.app}
                      onChange={(v) =>
                        setSlam((s) => ({
                          ...s,
                          aboutMe: {
                            ...s.aboutMe,
                            favorites: { ...s.aboutMe.favorites, app: v },
                          },
                        }))
                      }
                    />
                    <ScribbleField
                      label="holiday"
                      value={slam.aboutMe.favorites.holiday}
                      onChange={(v) =>
                        setSlam((s) => ({
                          ...s,
                          aboutMe: {
                            ...s.aboutMe,
                            favorites: { ...s.aboutMe.favorites, holiday: v },
                          },
                        }))
                      }
                    />
                    <ScribbleField
                      label="vlogger"
                      value={slam.aboutMe.favorites.vlogger}
                      onChange={(v) =>
                        setSlam((s) => ({
                          ...s,
                          aboutMe: {
                            ...s.aboutMe,
                            favorites: { ...s.aboutMe.favorites, vlogger: v },
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white/45 p-4">
                  <div
                    className="mb-2 sb-highlight sb-highlight--lemon"
                    style={{ fontFamily: "var(--font-scribble)" }}
                  >
                    your hobbies
                  </div>
                  <div className="grid gap-2">
                    {slam.aboutMe.hobbies.map((v, idx) => (
                      <ScribbleField
                        key={`hobby-${idx + 1}`}
                        placeholder="hobby"
                        value={v}
                        onChange={(nv) =>
                          setSlam((s) => {
                            const next = [...s.aboutMe.hobbies];
                            next[idx] = nv;
                            return {
                              ...s,
                              aboutMe: { ...s.aboutMe, hobbies: next },
                            };
                          })
                        }
                      />
                    ))}
                  </div>

                  <div
                    className="mt-4 mb-2 sb-highlight"
                    style={{ fontFamily: "var(--font-scribble)" }}
                  >
                    habits i do everyday
                  </div>
                  <div className="grid gap-2">
                    {slam.aboutMe.habits.map((v, idx) => (
                      <ScribbleField
                        key={`habit-${idx + 1}`}
                        placeholder="habit"
                        value={v}
                        onChange={(nv) =>
                          setSlam((s) => {
                            const next = [...s.aboutMe.habits];
                            next[idx] = nv;
                            return {
                              ...s,
                              aboutMe: { ...s.aboutMe, habits: next },
                            };
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ScribbleArea
                  className="rounded-2xl bg-white/45 p-4"
                  label="my interest"
                  rows={5}
                  value={slam.aboutMe.interests}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      aboutMe: { ...s.aboutMe, interests: v },
                    }))
                  }
                />
                <ScribbleArea
                  className="rounded-2xl bg-white/45 p-4"
                  label="5 things i want to do before i’m..."
                  rows={5}
                  value={slam.aboutMe.bucketList}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      aboutMe: { ...s.aboutMe, bucketList: v },
                    }))
                  }
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <ScribbleArea
                  className="rounded-2xl bg-white/45 p-4 md:col-span-1"
                  label="now playing"
                  rows={3}
                  value={slam.aboutMe.nowPlaying}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      aboutMe: { ...s.aboutMe, nowPlaying: v },
                    }))
                  }
                />
                <ScribbleArea
                  className="rounded-2xl bg-white/45 p-4 md:col-span-1"
                  label="motto"
                  rows={3}
                  value={slam.aboutMe.motto}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      aboutMe: { ...s.aboutMe, motto: v },
                    }))
                  }
                />
                <ScribbleArea
                  className="rounded-2xl bg-white/45 p-4 md:col-span-1"
                  label="fun facts"
                  rows={3}
                  value={slam.aboutMe.funFacts}
                  onChange={(v) =>
                    setSlam((s) => ({
                      ...s,
                      aboutMe: { ...s.aboutMe, funFacts: v },
                    }))
                  }
                />
              </div>
            </section>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-neutral-600">
          Tip: to read responses, visit{" "}
          <span className="font-semibold">/admin</span>
        </div>
      </div>
    </div>
  );
}
