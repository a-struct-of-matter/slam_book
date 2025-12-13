import crypto from "node:crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const region = process.env.AWS_REGION || "eu-north-1";
const bucketName = process.env.S3_BUCKET_NAME || "slam-book-5";

// Log configuration (without exposing secrets)
console.log("[S3 Config] Region:", region);
console.log("[S3 Config] Bucket:", bucketName);
console.log("[S3 Config] Access Key present:", !!accessKeyId);
console.log("[S3 Config] Secret Key present:", !!secretAccessKey);

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadPhotoToS3(
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<{ storageName: string; publicUrl: string }> {
  const ext = originalName.split(".").pop() || "bin";
  const storageName = `photos/${Date.now()}_${crypto.randomUUID()}.${ext}`;

  console.log("[S3 Upload] Starting upload:", storageName);
  console.log("[S3 Upload] File size:", fileBuffer.length, "bytes");

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: storageName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  try {
    const result = await s3Client.send(command);
    console.log("[S3 Upload] Success! ETag:", result.ETag);
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${storageName}`;
    console.log("[S3 Upload] Public URL:", publicUrl);
    return { storageName, publicUrl };
  } catch (error) {
    console.error("[S3 Upload] Error:", error);
    throw new Error(`Failed to upload to S3: ${error}`);
  }
}

export async function getPhotoFromS3(storageName: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: storageName,
  });

  try {
    const response = await s3Client.send(command);
    const buffer = await response.Body?.transformToByteArray();
    return Buffer.from(buffer || []);
  } catch (error) {
    console.error("S3 download error:", error);
    throw new Error("Failed to download from S3");
  }
}

export function getS3PublicUrl(storageName: string): string {
  return `https://${bucketName}.s3.${process.env.AWS_REGION || "eu-north-1"}.amazonaws.com/${storageName}`;
}
