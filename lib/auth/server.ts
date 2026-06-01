import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { db } from "@/database";
import { authSchema } from "@/database/schema/auth";
import { env } from "@/lib/env";

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
  plugins: [
    passkey(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp }) => {
        // TODO: Replace with real email provider (Resend, Nodemailer, etc.)
        await Promise.resolve();
        console.log(`[email-otp] To: ${email}`);
        console.log(`[email-otp] OTP: ${otp}`);
      },
    }),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  // TODO: i18n for error codes
});
