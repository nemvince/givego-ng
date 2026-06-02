import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "@/database/schema/auth";

export const accountTypeEnum = pgEnum("account_type", [
  "person",
  "organization",
]);

export const profile = pgTable(
  "profile",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    accountType: accountTypeEnum("account_type").notNull(),
    orgName: text("org_name"),
    registrationNumber: text("registration_number"),
    contactName: text("contact_name"),
    contactPhone: text("contact_phone"),
    website: text("website"),
    description: text("description"),
    logo: text("logo"),
    socialLinks: text("social_links"),
    showContactName: boolean("show_contact_name").notNull().default(true),
    showContactPhone: boolean("show_contact_phone").notNull().default(true),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("profile_userId_idx").on(table.userId)]
);

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));

export const profileSchema = {
  accountTypeEnum,
  profile,
};

export const profileRelationsExport = {
  profileRelations,
};
