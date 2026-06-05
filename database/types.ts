import type { InferSelectModel } from "drizzle-orm";
import type { passkey } from "@/database/schema/auth";
import type { events } from "@/database/schema/event";
import type { profile } from "@/database/schema/profile";
import type { userSettings } from "@/database/schema/settings";

export type Profile = InferSelectModel<typeof profile>;
export type UserSettings = InferSelectModel<typeof userSettings>;
export type Passkey = InferSelectModel<typeof passkey>;
export type Event = InferSelectModel<typeof events>;
