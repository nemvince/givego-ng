import { env } from "@/lib/env";
import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";

const ALLOWED_ORIGINS = [env.BETTER_AUTH_URL];

const client = new S3Client({
  region: env.BETTER_UPLOAD_REGION,
  endpoint: env.BETTER_UPLOAD_HOST,
  credentials: {
    accessKeyId: env.BETTER_UPLOAD_KEY_ID,
    secretAccessKey: env.BETTER_UPLOAD_SECRET,
  },
  forcePathStyle: true,
});

async function main() {
  const command = new PutBucketCorsCommand({
    Bucket: env.BETTER_UPLOAD_BUCKET_NAME,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          AllowedOrigins: ALLOWED_ORIGINS,
          ExposeHeaders: ["ETag", "x-amz-request-id"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  });

  console.log(
    `Configuring CORS on bucket "${env.BETTER_UPLOAD_BUCKET_NAME}"...`
  );
  await client.send(command);
  console.log(`CORS configured for origins: ${ALLOWED_ORIGINS.join(", ")}`);
}

main().catch((err) => {
  console.error("Failed to configure CORS:", err);
  process.exit(1);
});
