import { PlusIcon } from "@phosphor-icons/react/ssr";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { EventsExplorer } from "@/components/events/events-explorer";
import { Button } from "@/components/ui/button";
import { db } from "@/database";
import { eventSignups, events } from "@/database/schema/event";
import { auth } from "@/lib/auth/server";
import { Link } from "@/lib/i18n/navigation";

export default async function EventsPage() {
  const t = await getTranslations("events.browse");
  const tCreate = await getTranslations("events.create");

  const session = await auth.api.getSession({ headers: await headers() });
  const isOrg = !!session?.user;

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
    .orderBy(asc(events.startDate));

  const allThemes = [...new Set(rows.map((r) => r.event.theme))].sort();

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-8 sm:px-8 sm:pt-16">
        <p className="font-mono text-accent text-xs uppercase tracking-widest">
          {t("hero.label")}
        </p>
        <h1 className="mt-2 text-balance font-semibold font-serif text-4xl text-foreground tracking-tight sm:text-5xl">
          {t("hero.heading")}
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground leading-relaxed">
          {t("hero.description")}
        </p>
        {isOrg && (
          <Button
            className="mt-6 rounded-full"
            nativeButton={false}
            render={
              <Link href="/events/create">
                <PlusIcon className="size-4" />
                {tCreate("title")}
              </Link>
            }
          />
        )}
      </section>
      <EventsExplorer eventsData={rows} themes={allThemes} />
    </div>
  );
}
