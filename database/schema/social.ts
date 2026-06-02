import {
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "@/database/schema/auth";

export const favoriteTargetTypeEnum = pgEnum("favorite_target_type", [
  "event",
  "organization",
]);

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    targetType: favoriteTargetTypeEnum("target_type").notNull(),
    targetId: text("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("favorites_userId_idx").on(table.userId),
    index("favorites_targetType_targetId_idx").on(
      table.targetType,
      table.targetId
    ),
    unique("favorites_userId_targetType_targetId_unique").on(
      table.userId,
      table.targetType,
      table.targetId
    ),
  ]
);

export const organizationFollows = pgTable(
  "organization_follows",
  {
    id: serial("id").primaryKey(),
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("organizationFollows_followerId_idx").on(table.followerId),
    index("organizationFollows_organizationId_idx").on(table.organizationId),
    unique("organizationFollows_followerId_organizationId_unique").on(
      table.followerId,
      table.organizationId
    ),
  ]
);

export const socialSchema = {
  favoriteTargetTypeEnum,
  favorites,
  organizationFollows,
};

export const socialRelations = {};
