import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "@/database/schema/auth";

export const newsletterSubscriptionStatusEnum = pgEnum(
  "newsletter_subscription_status",
  ["subscribed", "unsubscribed"]
);

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  status: newsletterSubscriptionStatusEnum("status")
    .notNull()
    .default("subscribed"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const newsletterSchema = {
  newsletterSubscriptionStatusEnum,
  newsletterSubscriptions,
};

export const newsletterRelations = {};
