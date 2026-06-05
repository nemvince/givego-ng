"use server";

import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/database";
import { eventSignups, events } from "@/database/schema/event";
import { auth } from "@/lib/auth/server";

export async function signupForEvent(eventId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const [event] = await db
    .select({
      organizerId: events.organizerId,
      maxVolunteers: events.maxVolunteers,
    })
    .from(events)
    .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
    .limit(1);

  if (!event) {
    return { success: false, error: "Event not found" };
  }

  if (event.organizerId === session.user.id) {
    return { success: false, error: "own_event" };
  }

  const [existing] = await db
    .select({ id: eventSignups.id })
    .from(eventSignups)
    .where(
      and(
        eq(eventSignups.eventId, eventId),
        eq(eventSignups.userId, session.user.id),
        isNull(eventSignups.deletedAt)
      )
    )
    .limit(1);

  if (existing) {
    return { success: true, alreadySignedUp: true };
  }

  if (event.maxVolunteers != null) {
    const [countResult] = await db
      .select({ count: db.$count(eventSignups) } as never)
      .from(eventSignups)
      .where(
        and(eq(eventSignups.eventId, eventId), isNull(eventSignups.deletedAt))
      );

    const currentCount =
      (countResult as { count: number } | undefined)?.count ?? 0;
    if (currentCount >= event.maxVolunteers) {
      return { success: false, error: "full" };
    }
  }

  await db.insert(eventSignups).values({
    eventId,
    userId: session.user.id,
  });

  return { success: true };
}

export async function cancelSignup(eventId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  await db
    .update(eventSignups)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(eventSignups.eventId, eventId),
        eq(eventSignups.userId, session.user.id),
        isNull(eventSignups.deletedAt)
      )
    );

  return { success: true };
}
