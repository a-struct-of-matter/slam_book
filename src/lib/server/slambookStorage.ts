import crypto from "node:crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

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

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.S3_BUCKET_NAME || "slam-book-5";
const SUBMISSIONS_KEY = "submissions/submissions.json";

export function generateId(prefix = "sub") {
  return `${prefix}_${crypto.randomUUID()}`;
}

export async function readAllSubmissions(): Promise<SlambookSubmission[]> {
  try {
    console.log("[S3] Fetching submissions from S3...");
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: SUBMISSIONS_KEY,
    });
    const response = await s3Client.send(command);
    const buffer = await response.Body?.transformToByteArray();
    const json = Buffer.from(buffer || []).toString("utf-8");
    const parsed = JSON.parse(json) as unknown;
    console.log("[S3] Submissions fetched successfully");
    return Array.isArray(parsed) ? (parsed as SlambookSubmission[]) : [];
  } catch (error: any) {
    if (error.Code === "NoSuchKey") {
      console.log("[S3] No submissions file found, starting fresh");
      return [];
    }
    console.error("[S3] Error fetching submissions:", error);
    return [];
  }
}

export async function appendSubmission(
  submission: Omit<SlambookSubmission, "id" | "createdAt">,
): Promise<SlambookSubmission> {
  const full: SlambookSubmission = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...submission,
  };

  try {
    console.log("[S3] Reading existing submissions...");
    const all = await readAllSubmissions();
    all.unshift(full);

    console.log("[S3] Uploading submissions to S3...");
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: SUBMISSIONS_KEY,
      Body: JSON.stringify(all, null, 2),
      ContentType: "application/json",
    });
    await s3Client.send(command);
    console.log("[S3] Submission saved successfully");
    return full;
  } catch (error) {
    console.error("[S3] Error saving submission:", error);
    throw new Error("Failed to save submission to S3");
  }
}
