import type { passkey } from "@/database/schema/auth";
import type { events } from "@/database/schema/event";
import { helpModeEnum, workTypeEnum } from "@/database/schema/event";
import type { profile } from "@/database/schema/profile";
import type { userSettings } from "@/database/schema/settings";
import type { InferSelectModel } from "drizzle-orm";

export type Profile = InferSelectModel<typeof profile>;
export type UserSettings = InferSelectModel<typeof userSettings>;
export type Passkey = InferSelectModel<typeof passkey>;
export type Event = InferSelectModel<typeof events>;

export const workTypes = workTypeEnum.enumValues as readonly string[];
export type WorkType = (typeof workTypes)[number];

export const helpModes = helpModeEnum.enumValues as readonly string[];
export type HelpMode = (typeof helpModes)[number];
