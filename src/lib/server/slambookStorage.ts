import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type SlambookPhoto = {
  storageName: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type SlambookSubmission = {
  id: string;
  createdAt: string;
  payload: unknown;
  photo?: SlambookPhoto;
};

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

async function ensureDataFiles() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(SUBMISSIONS_FILE);
  } catch {
    await fs.writeFile(SUBMISSIONS_FILE, "[]\n", "utf8");
  }
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}

export function generateId(prefix = "sub") {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function readAllSubmissions(): Promise<SlambookSubmission[]> {
  await ensureDataFiles();
  const raw = await fs.readFile(SUBMISSIONS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SlambookSubmission[]) : [];
  } catch {
    return [];
  }
}

async function atomicWrite(filePath: string, contents: string) {
  const tmp = `${filePath}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, contents, "utf8");
  await fs.rename(tmp, filePath);
}

export async function appendSubmission(
  submission: Omit<SlambookSubmission, "id" | "createdAt">,
): Promise<SlambookSubmission> {
  await ensureDataFiles();
  const full: SlambookSubmission = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...submission,
  };

  const all = await readAllSubmissions();
  all.unshift(full);
  await atomicWrite(SUBMISSIONS_FILE, `${JSON.stringify(all, null, 2)}\n`);
  return full;
}
