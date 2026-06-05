import {
  CalendarCheckIcon,
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  MapPinIcon,
  RepeatIcon,
  TagIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EventSignup } from "@/components/events/event-signup";
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";
import { Badge } from "@/components/ui/badge";
import { db } from "@/database";
import { user } from "@/database/schema/auth";
import {
  eventSignups,
  events,
  eventTags,
  tagTranslations,
} from "@/database/schema/event";
import type { Event } from "@/database/types";
import { auth } from "@/lib/auth/server";

type PageParams = {
  id: string;
  locale: string;
};

function parseGalleryImages(event: Event) {
  try {
    const parsed = JSON.parse(event.galleryImages);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as string[];
    }
  } catch {
    // not valid JSON
  }
  return [];
}

function parseRrule(event: Event): string | null {
  if (!(event.isRecurring && event.rrule)) {
    return null;
  }
  try {
    const parsed = JSON.parse(event.rrule);
    if (parsed.weekdays && Array.isArray(parsed.weekdays)) {
      return "recurring";
    }
  } catch {
    // not valid JSON
  }
  return null;
}

function formatDateFull(date: string | Date | null, locale: string) {
  if (!date) {
    return "—";
  }
  return new Date(date).toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeOnly(date: string | Date | null, locale: string) {
  if (!date) {
    return "—";
  }
  return new Date(date).toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const t = await getTranslations("events.detail");
  const tWorkTypes = await getTranslations("events.create.basicInfo.workTypes");
  const tHelpModes = await getTranslations(
    "events.create.volunteers.helpModes"
  );
  const { id, locale } = await params;
  const eventId = Number.parseInt(id, 10);

  if (Number.isNaN(eventId)) {
    notFound();
  }

  const sessionData = await auth.api.getSession({ headers: await headers() });

  const rows = await db
    .select({
      event: events,
      signupCount: sql<number>`cast(count(${eventSignups.id}) as int)`,
      organizer: {
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
      },
    })
    .from(events)
    .leftJoin(user, eq(events.organizerId, user.id))
    .leftJoin(
      eventSignups,
      and(eq(events.id, eventSignups.eventId), isNull(eventSignups.deletedAt))
    )
    .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
    .groupBy(events.id, user.id)
    .limit(1);

  if (rows.length === 0) {
    notFound();
  }

  const { event, signupCount, organizer } = rows[0];

  const eventTagRows = await db
    .select({ name: tagTranslations.name })
    .from(eventTags)
    .innerJoin(tagTranslations, eq(eventTags.tagId, tagTranslations.tagId))
    .where(
      and(
        eq(eventTags.eventId, eventId),
        isNull(eventTags.deletedAt),
        eq(tagTranslations.locale, locale)
      )
    )
    .orderBy(asc(tagTranslations.name));

  const galleryUrls = parseGalleryImages(event);
  const recurrence = parseRrule(event);

  const workTypeLabels: Record<string, string> = {
    physical: tWorkTypes("physical"),
    social: tWorkTypes("social"),
    office: tWorkTypes("office"),
  };

  const helpModeLabels: Record<string, string> = {
    online: tHelpModes("online"),
    personal: tHelpModes("personal"),
    hybrid: tHelpModes("hybrid"),
  };

  const facts = [
    {
      icon: CalendarIcon,
      label: t("date"),
      value: formatDateFull(event.startDate, locale),
    },
    {
      icon: ClockIcon,
      label: t("time"),
      value: formatTimeOnly(event.startDate, locale),
    },
    {
      icon: CalendarCheckIcon,
      label: t("activity"),
      value: workTypeLabels[event.workType] ?? event.workType,
    },
    {
      icon: GlobeIcon,
      label: t("format"),
      value: helpModeLabels[event.helpMode] ?? event.helpMode,
    },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <BreadcrumbTrail
        className="mb-6 w-auto pt-0"
        items={[
          { href: "/", isTranslationKey: true, label: "navigation.home" },
          {
            href: "/events",
            isTranslationKey: true,
            label: "events.title",
          },
          { label: event.title },
        ]}
      />

      <div className="relative h-64 overflow-hidden rounded-3xl border border-border sm:h-80 md:h-96">
        <Image
          alt={event.title}
          className="object-cover"
          fill
          priority
          src={event.imageUrl || "/placeholder.svg"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 flex flex-wrap items-center gap-2 p-6">
          <span className="rounded-full bg-card/90 px-3 py-1 font-medium text-foreground text-xs backdrop-blur">
            {event.theme}
          </span>
          <span className="rounded-full bg-card/90 px-3 py-1 font-medium text-foreground text-xs capitalize backdrop-blur">
            {event.status}
          </span>
          {recurrence && (
            <span className="flex items-center gap-1 rounded-full bg-card/90 px-3 py-1 font-medium text-foreground text-xs backdrop-blur">
              <RepeatIcon className="size-3" />
              {t("recurrence")}
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <h1 className="text-balance font-semibold font-serif text-4xl text-foreground tracking-tight sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="size-4 text-primary" />
            {event.address}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                key={fact.label}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <fact.icon className="size-4" />
                </span>
                <div>
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    {fact.label}
                  </p>
                  <p className="font-medium text-foreground text-sm capitalize">
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="font-semibold font-serif text-2xl text-foreground">
              {t("aboutEvent")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {eventTagRows.length > 0 && (
            <div className="mt-8">
              <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <TagIcon className="size-4 text-primary" />
                {t("tags")}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {eventTagRows.map((tag) => (
                  <Badge key={tag.name} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {galleryUrls.length > 1 && (
            <div className="mt-10">
              <h3 className="font-semibold font-serif text-foreground text-xl">
                {t("gallery")}
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {galleryUrls.map((img) => (
                  <div
                    className="relative h-44 overflow-hidden rounded-2xl border border-border"
                    key={img}
                  >
                    <Image
                      alt={`${event.title} photo ${galleryUrls.indexOf(img) + 1}`}
                      className="object-cover"
                      fill
                      src={img || "/placeholder.svg"}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <EventSignup
            currentUserId={sessionData?.user?.id ?? null}
            event={event}
            signupCount={signupCount}
          />

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              {t("hostedBy")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative size-12 overflow-hidden rounded-full border border-border">
                <Image
                  alt={organizer?.name ?? ""}
                  className="object-cover"
                  fill
                  src={organizer?.image || "/placeholder.svg"}
                />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {organizer?.name ?? "—"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {organizer?.createdAt
                    ? new Date(organizer.createdAt).getFullYear()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <UsersIcon className="size-4 text-primary" />
              {t("volunteerGoal")}
            </h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              {event.minVolunteers != null || event.maxVolunteers != null
                ? t("volunteerNeeds", {
                    min: event.minVolunteers ?? 0,
                    max: event.maxVolunteers ?? "—",
                  })
                : t("noVolunteerLimit")}
            </p>
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {t("signedUp", { count: signupCount })}
                </span>
                {event.maxVolunteers != null && (
                  <span className="font-medium text-muted-foreground">
                    {t("spotsLeft", {
                      count: event.maxVolunteers - signupCount,
                    })}
                  </span>
                )}
              </div>
              {event.maxVolunteers != null && event.maxVolunteers > 0 && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.round((signupCount / event.maxVolunteers) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
