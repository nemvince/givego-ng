import type { formats } from "@/lib/i18n/request";
import type { routing } from "@/lib/i18n/routing";
import type messages from "@/messages/en.json";

declare module "next-intl" {
  type AppConfig = {
    Formats: typeof formats;
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  };
}
