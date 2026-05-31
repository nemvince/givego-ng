import { db } from "@/database";
import { authSchema } from "@/database/schema/auth";
import { env } from "@/lib/env";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const getBaseURL = () => {
  if (env.RAILWAY_PUBLIC_DOMAIN) {
    return env.RAILWAY_PUBLIC_DOMAIN;
  }
  return env.BETTER_AUTH_URL;
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  secret: env.BETTER_AUTH_SECRET,
  appName: "GiveGo",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  plugins: [passkey()],
  emailAndPassword: {
    enabled: true,
  },
  // TODO: i18n for error codes
});
