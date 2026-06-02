import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "@/database/schema/auth";

export const workTypeEnum = pgEnum("work_type", [
  "physical",
  "social",
  "office",
]);
export const helpModeEnum = pgEnum("help_mode", [
  "online",
  "personal",
  "hybrid",
]);
export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "ongoing",
  "completed",
  "cancelled",
]);

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    organizerId: text("organizer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    address: text("address").notNull(),
    theme: text("theme").notNull(),
    workType: workTypeEnum("work_type").notNull(),
    description: text("description").notNull(),
    isRecurring: boolean("is_recurring").notNull().default(false),
    helpMode: helpModeEnum("help_mode").notNull().default("personal"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    rrule: text("rrule"),
    status: eventStatusEnum("status").notNull().default("draft"),
    cancellationReason: text("cancellation_reason"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    minVolunteers: integer("min_volunteers"),
    maxVolunteers: integer("max_volunteers"),
    imageUrl: text("image_url"),
    galleryImages: text("gallery_images").notNull().default("[]"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("events_organizerId_idx").on(table.organizerId),
    index("events_status_idx").on(table.status),
    index("events_coordinates_idx").on(table.latitude, table.longitude),
  ]
);

export const eventTags = pgTable(
  "event_tags",
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.tagId] })]
);

export const tagTranslations = pgTable(
  "tag_translations",
  {
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.tagId, t.locale] })]
);

export const eventSignups = pgTable(
  "event_signups",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("eventSignups_eventId_idx").on(table.eventId),
    index("eventSignups_userId_idx").on(table.userId),
    (t: typeof table) => ({ unique: [t.eventId, t.userId] }),
  ]
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(user, {
    fields: [events.organizerId],
    references: [user.id],
  }),
  eventTags: many(eventTags),
  signups: many(eventSignups),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  eventTags: many(eventTags),
  translations: many(tagTranslations),
}));

export const eventTagsRelations = relations(eventTags, ({ one }) => ({
  event: one(events, {
    fields: [eventTags.eventId],
    references: [events.id],
  }),
  tag: one(tags, {
    fields: [eventTags.tagId],
    references: [tags.id],
  }),
}));

export const tagTranslationsRelations = relations(
  tagTranslations,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagTranslations.tagId],
      references: [tags.id],
    }),
  })
);

export const eventSignupsRelations = relations(eventSignups, ({ one }) => ({
  event: one(events, {
    fields: [eventSignups.eventId],
    references: [events.id],
  }),
  user: one(user, {
    fields: [eventSignups.userId],
    references: [user.id],
  }),
}));

export const eventSchema = {
  workTypeEnum,
  helpModeEnum,
  eventStatusEnum,
  tags,
  events,
  eventTags,
  tagTranslations,
  eventSignups,
};

export const eventRelations = {
  eventsRelations,
  tagsRelations,
  eventTagsRelations,
  tagTranslationsRelations,
  eventSignupsRelations,
};
