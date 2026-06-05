"use server";

import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import type { EventWizardData } from "@/components/events/wizard/schemas/event-wizard";
import { db } from "@/database";
import {
  events,
  eventTags,
  tags,
  tagTranslations,
} from "@/database/schema/event";
import { requireOrg } from "@/lib/auth/guards";

export async function getTagsForLocale(locale: string) {
  return await db
    .select({
      id: tags.id,
      name: tagTranslations.name,
    })
    .from(tags)
    .innerJoin(tagTranslations, eq(tags.id, tagTranslations.tagId))
    .where(and(isNull(tags.deletedAt), eq(tagTranslations.locale, locale)));
}

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  theme: z.string().min(1),
  workType: z.enum(["physical", "social", "office"]),
  description: z.string().min(1),
  tagIds: z.array(z.number().int()).min(1),
  address: z.string().min(1),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isRecurring: z.boolean(),
  weekdays: z.array(z.number().int()).optional(),
  timeslots: z
    .array(z.object({ start: z.string(), end: z.string() }))
    .optional(),
  helpMode: z.enum(["online", "personal", "hybrid"]),
  minVolunteers: z.number().int().positive().nullable().optional(),
  maxVolunteers: z.number().int().positive().nullable().optional(),
});

export async function createEvent(
  data: EventWizardData
): Promise<{ success: boolean; eventId?: number; error?: string }> {
  const { session, error: authError } = await requireOrg();
  if (authError || !session?.user) {
    return { success: false, error: authError ?? "Unauthorized" };
  }

  const parsed = createEventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  const { tagIds, weekdays, timeslots, ...eventData } = parsed.data;

  const rrule =
    eventData.isRecurring && weekdays && timeslots
      ? JSON.stringify({ weekdays, timeslots })
      : null;

  const result = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(events)
      .values({
        organizerId: session.user.id,
        title: eventData.title,
        address: eventData.address,
        theme: eventData.theme,
        workType: eventData.workType,
        description: eventData.description,
        isRecurring: eventData.isRecurring,
        helpMode: eventData.helpMode,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        rrule,
        latitude: eventData.latitude ?? null,
        longitude: eventData.longitude ?? null,
        minVolunteers: eventData.minVolunteers ?? null,
        maxVolunteers: eventData.maxVolunteers ?? null,
        status: "draft",
        galleryImages: "[]",
      })
      .returning({ id: events.id });

    if (!inserted) {
      throw new Error("Failed to insert event");
    }

    if (tagIds.length > 0) {
      await tx.insert(eventTags).values(
        tagIds.map((tagId) => ({
          eventId: inserted.id,
          tagId,
        }))
      );
    }

    return inserted.id;
  });

  return { success: true, eventId: result };
}
