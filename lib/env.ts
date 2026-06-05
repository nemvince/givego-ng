import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    // Database connection URL for Drizzle ORM
    DATABASE_URL: z.url(),

    // Better Auth for authentication and session management
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(16),

    // Tigris S3 storage for file uploads
    BETTER_UPLOAD_HOST: z.url(),
    BETTER_UPLOAD_REGION: z.string(),
    BETTER_UPLOAD_BUCKET_NAME: z.string(),
    BETTER_UPLOAD_KEY_ID: z.string(),
    BETTER_UPLOAD_SECRET: z.string(),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_UPLOAD_HOST: process.env.BETTER_UPLOAD_HOST,
    BETTER_UPLOAD_REGION: process.env.BETTER_UPLOAD_REGION,
    BETTER_UPLOAD_BUCKET_NAME: process.env.BETTER_UPLOAD_BUCKET_NAME,
    BETTER_UPLOAD_KEY_ID: process.env.BETTER_UPLOAD_KEY_ID,
    BETTER_UPLOAD_SECRET: process.env.BETTER_UPLOAD_SECRET,
  },
});
