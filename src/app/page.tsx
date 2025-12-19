"use client";

import { useMemo, useState } from "react";
import {
	HeartDoodle,
	SparkleDoodle,
	CameraDoodle,
} from "@/components/slambook/Doodles";
import {
	ScribbleArea,
	ScribbleField,
} from "@/components/slambook/ScribbleField";

// Final mixed questions (all focused on her)
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

// Updated SlamPayload to focus on 'her' (the recipient)
type SlamPayload = {
	aboutMe: {
		// Basic Info (renamed to recipient)
		name: string;
		birthday: string;
		currentPlace: string;
		zodiac: string;

		// Favorites
		favorites: {
			food: string;
			animal: string;
			place: string;
			movie: string;
			app: string;
			holiday: string;
			vlogger: string;
			song: string; // New: Favorite Song
			book: string; // New: Favorite Book
			color: string; // New: Favorite Color
		};

		// Personal Insights
		quirks: string[]; // Moved and renamed from 'friendships'
		hobbies: string[];
		habits: string[];
		interests: string;

		// Future and Messages
		bucketList: string;
		nowPlaying: string;
		motto: string;
		funFacts: string;
		messageToSelf: string; // New: Message to future self
		bestQuality: string; // New: Your best quality
		secretTalent: string; // New: Secret talent
		futureJob: string; // New: Dream job
		dreamDestination: string; // New: Dream destination

		// QA: mapped final questions (q0, q1, ...)
		qa: Record<string, string>;
	};
};

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
					song: "",
					book: "",
					color: "",
				},
				quirks: ["", "", ""],
				hobbies: ["", "", "", ""],
				habits: ["", "", "", ""],
				interests: "",
				bucketList: "",
				nowPlaying: "",
				motto: "",
				funFacts: "",
				messageToSelf: "",
				bestQuality: "",
				secretTalent: "",
				futureJob: "",
				dreamDestination: "",
				qa: Object.fromEntries(QUESTIONS.map((_, i) => [`q${i}`, ""])),
			},
		}),
		[],
	);

	const [slam, setSlam] = useState<SlamPayload>(initial);
	const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
		"idle",
	);
	const [error, setError] = useState<string>("");
	const [photo, setPhoto] = useState<File | null>(null);

	async function submit() {
		setStatus("saving");
		setError("");
		try {
			const fd = new FormData();
			// Only send the 'aboutMe' data now
			fd.set("payload", JSON.stringify(slam));

			if (photo) {
				fd.set("photo", photo);
			}

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
			<div className="mx-auto max-w-4xl">
				<div className="mb-6 flex items-end justify-between gap-4">
					<div>
						<div className="inline-flex items-center gap-2">
							<span
								className="sb-highlight"
								style={{ fontFamily: "var(--font-scribble)" }}
							>
								my slambook
							</span>
							<span
								className="sb-highlight sb-highlight--lemon"
								style={{ fontFamily: "var(--font-scribble)" }}
							>
								a page for you
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
							className="sb-scribble sb-highlight px-4 py-2 text-[14px]"
							style={{ fontFamily: "var(--font-scribble)" }}
						>
							reset page
						</button>
						<button
							type="button"
							onClick={submit}
							disabled={status === "saving"}
							className="sb-scribble sb-highlight sb-highlight--peach px-5 py-2 text-[14px]"
							style={{ fontFamily: "var(--font-scribble)" }}
						>
							{status === "saving" ? "saving..." : "send my entry"}
						</button>
					</div>
				</div>

				{status === "saved" ? (
					<div className="mb-6 rounded-2xl bg-white/70 px-4 py-3 text-sm text-neutral-800 shadow-sm">
						<span
							className="sb-highlight sb-highlight--peach"
							style={{ fontFamily: "var(--font-scribble)" }}
						>
							sent!
						</span>{" "}
						Thanks for filling out your page!
					</div>
				) : null}

				{status === "error" ? (
					<div className="mb-6 rounded-2xl bg-white/70 px-4 py-3 text-sm text-red-700 shadow-sm">
						<span className="font-semibold">Oops:</span> {error}
					</div>
				) : null}

				<div className="sb-paper sb-grid relative overflow-hidden p-6 md:p-8">
					<HeartDoodle className="sb-doodle left-6 top-6 h-14 w-14 -rotate-6" />
					<SparkleDoodle className="sb-doodle right-10 top-10 h-12 w-12 rotate-6" />
					<CameraDoodle className="sb-doodle right-6 bottom-6 h-14 w-14 rotate-6 opacity-80" />

					<section className="relative rounded-2xl bg-white/55 p-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
						<div className="mb-6 flex items-center justify-between">
							<div
								className="sb-highlight"
								style={{ fontFamily: "var(--font-scribble)", fontSize: 22 }}
							>
								A Little Bit About you...(actually not a little)
							</div>
							<div
								className="sb-highlight sb-highlight--lemon"
								style={{ fontFamily: "var(--font-scribble)" }}
							>
								Current Vibes
							</div>
						</div>

						<div className="grid gap-3 md:grid-cols-2">
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
							<ScribbleField
								label="birthday (month/day)"
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

						{/* Photo Upload Section */}
						<div className="mt-6 rounded-2xl bg-white/45 p-3">
							<div
								className="mb-2 sb-highlight sb-highlight--lemon text-sm"
								style={{ fontFamily: "var(--font-scribble)" }}
							>
								Add a Photo
							</div>
							<label className="block cursor-pointer">
								<div className="sb-scribble rounded-lg border-2 border-dashed border-neutral-300 p-3 text-center text-sm text-neutral-700 hover:bg-white/20">
									<div style={{ fontFamily: "var(--font-scribble)" }}>
										{photo ? `📷 ${photo.name}` : "drop a photo"}
									</div>
									<div className="mt-1 text-xs text-neutral-500">
										jpg / png / webp
									</div>
								</div>
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
								/>
							</label>
						</div>

						{/* Favorites Section */}
						<div className="mt-8 rounded-2xl bg-white/45 p-4">
							<div
								className="mb-3 sb-highlight sb-highlight--peach"
								style={{ fontFamily: "var(--font-scribble)" }}
							>
								My Current Favorites
							</div>
							<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
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
									label="place to chill"
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
									label="movie/show"
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
									label="vlogger/creator"
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
								<ScribbleField
									label="song right now"
									value={slam.aboutMe.favorites.song}
									onChange={(v) =>
										setSlam((s) => ({
											...s,
											aboutMe: {
												...s.aboutMe,
												favorites: { ...s.aboutMe.favorites, song: v },
											},
										}))
									}
								/>
								<ScribbleField
									label="book"
									value={slam.aboutMe.favorites.book}
									onChange={(v) =>
										setSlam((s) => ({
											...s,
											aboutMe: {
												...s.aboutMe,
												favorites: { ...s.aboutMe.favorites, book: v },
											},
										}))
									}
								/>
								<ScribbleField
									label="color"
									value={slam.aboutMe.favorites.color}
									onChange={(v) =>
										setSlam((s) => ({
											...s,
											aboutMe: {
												...s.aboutMe,
												favorites: { ...s.aboutMe.favorites, color: v },
											},
										}))
									}
								/>
							</div>
						</div>

						{/* Hobbies & Habits Section */}
						<div className="mt-8 grid gap-4 md:grid-cols-2">
							<div className="rounded-2xl bg-white/45 p-4">
								<div
									className="mb-2 sb-highlight sb-highlight--lemon"
									style={{ fontFamily: "var(--font-scribble)" }}
								>
									My Top Hobbies
								</div>
								<div className="grid gap-2">
									{slam.aboutMe.hobbies.map((v, idx) => (
										<ScribbleField
											key={`hobby-${idx + 1}`}
											placeholder={`hobby ${idx + 1}`}
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
									My Daily Habits
								</div>
								<div className="grid gap-2">
									{slam.aboutMe.habits.map((v, idx) => (
										<ScribbleField
											key={`habit-${idx + 1}`}
											placeholder={`habit ${idx + 1}`}
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

							<div className="rounded-2xl bg-white/45 p-4">
								<div
									className="mb-2 sb-highlight sb-highlight--peach"
									style={{ fontFamily: "var(--font-scribble)" }}
								>
									My Quirks(wierd things about you)
								</div>
								<div className="grid gap-2">
									{slam.aboutMe.quirks.map((v, idx) => (
										<ScribbleField
											key={`quirk-${idx + 1}`}
											placeholder={`quirk ${idx + 1}`}
											value={v}
											onChange={(nv) =>
												setSlam((s) => {
													const next = [...s.aboutMe.quirks];
													next[idx] = nv;
													return {
														...s,
														aboutMe: { ...s.aboutMe, quirks: next },
													};
												})
											}
										/>
									))}
								</div>

								<ScribbleField
									className="mt-4"
									label="My Best Quality"
									value={slam.aboutMe.bestQuality}
									onChange={(v) =>
										setSlam((s) => ({
											...s,
											aboutMe: { ...s.aboutMe, bestQuality: v },
										}))
									}
								/>

								<ScribbleField
									className="mt-4"
									label="My Secret Talent"
									value={slam.aboutMe.secretTalent}
									onChange={(v) =>
										setSlam((s) => ({
											...s,
											aboutMe: { ...s.aboutMe, secretTalent: v },
										}))
									}
								/>

								<ScribbleField
									className="mt-4"
									label="My Dream Job"
									value={slam.aboutMe.futureJob}
									onChange={(v) =>
										setSlam((s) => ({
											...s,
											aboutMe: { ...s.aboutMe, futureJob: v },
										}))
									}
								/>
							</div>
						</div>

						{/* Area Fields */}
						<div className="mt-8 grid gap-4 md:grid-cols-2">
							<ScribbleArea
								className="rounded-2xl bg-white/45 p-4"
								label="What I'm passionate about (interests)"
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
								label="5 things I want to do (bucket list)"
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

						{/* Future/Message Fields */}
						<div className="mt-8 grid gap-4 md:grid-cols-3">
							<ScribbleArea
								className="rounded-2xl bg-white/45 p-4 md:col-span-1"
								label="My Life Motto"
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
								label="A Message to My Future Self"
								rows={3}
								value={slam.aboutMe.messageToSelf}
								onChange={(v) =>
									setSlam((s) => ({
										...s,
										aboutMe: { ...s.aboutMe, messageToSelf: v },
									}))
								}
							/>
							<ScribbleArea
								className="rounded-2xl bg-white/45 p-4 md:col-span-1"
								label="Fun Facts About Me"
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

						<div className="mt-8 grid gap-4 md:grid-cols-2">
							<ScribbleField
								label="Currently listening to (song/artist)"
								value={slam.aboutMe.nowPlaying}
								onChange={(v) =>
									setSlam((s) => ({
										...s,
										aboutMe: { ...s.aboutMe, nowPlaying: v },
									}))
								}
							/>
							<ScribbleField
								label="Dream travel destination"
								value={slam.aboutMe.dreamDestination}
								onChange={(v) =>
									setSlam((s) => ({
										...s,
										aboutMe: { ...s.aboutMe, dreamDestination: v },
									}))
								}
							/>
						</div>

						{/* === Embedded final mixed questions === */}
						<div className="mt-8 rounded-2xl bg-white/45 p-4">
							<div
								className="mb-3 sb-highlight sb-highlight--peach"
								style={{ fontFamily: "var(--font-scribble)" }}
							>
								Quick Questions (all about you)
							</div>

							<div className="grid gap-3">
								{QUESTIONS.map((q, idx) => {
									const key = `q${idx}`;
									return (
										<ScribbleField
											key={key}
											label={q}
											value={slam.aboutMe.qa[key] ?? ""}
											onChange={(v) =>
												setSlam((s) => ({
													...s,
													aboutMe: {
														...s.aboutMe,
														qa: { ...s.aboutMe.qa, [key]: v },
													},
												}))
											}
										/>
									);
								})}
							</div>
						</div>
					</section>
				</div>

				<div className="mt-5 text-center text-xs text-neutral-600">
					Fact: You are special to the guy who sent you this... {" "}
					<span className="font-semibold"></span>
				</div>
			</div>
		</div>
	);
}
