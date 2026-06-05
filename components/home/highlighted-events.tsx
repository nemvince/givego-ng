import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EventTile } from "@/components/events/event-tile";
import { Button } from "@/components/ui/button";
import { db } from "@/database";
import { eventSignups, events } from "@/database/schema/event";

export async function HighlightedEvents() {
  const t = await getTranslations("homePage.highlightedEvents");

  const rows = await db
    .select({
      event: events,
      signupCount: sql<number>`cast(count(${eventSignups.id}) as int)`,
    })
    .from(events)
    .leftJoin(
      eventSignups,
      and(eq(events.id, eventSignups.eventId), isNull(eventSignups.deletedAt))
    )
    .where(and(eq(events.status, "published"), isNull(events.deletedAt)))
    .groupBy(events.id)
    .orderBy(asc(events.startDate))
    .limit(6);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8" id="events">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            {t("label")}
          </p>
          <h2 className="mt-2 text-balance font-semibold font-serif text-4xl text-foreground tracking-tight sm:text-5xl">
            {t("heading")}
          </h2>
        </div>
        <Button
          className="group text-foreground hover:bg-secondary"
          nativeButton={false}
          render={
            <Link href="/events">
              {t("browseAll")}
              <ArrowUpRightIcon className="ml-1 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
          variant="ghost"
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ event, signupCount }) => (
          <EventTile event={event} key={event.id} signupCount={signupCount} />
        ))}
      </div>
    </section>
  );
}
