import {
  boolean,
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "@/database/schema/auth";

export const notificationTypeEnum = pgEnum("notification_type", [
  "event_published",
  "event_reminder",
  "new_signup",
  "event_cancelled",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    emailSent: boolean("email_sent").notNull().default(false),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("notifications_userId_idx").on(table.userId),
    index("notifications_userId_isRead_idx").on(table.userId, table.isRead),
    index("notifications_createdAt_idx").on(table.createdAt),
  ]
);

export const notificationSchema = {
  notificationTypeEnum,
  notifications,
};

export const notificationRelations = {};
