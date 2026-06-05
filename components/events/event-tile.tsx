"use client";

import { CalendarIcon, MapPinIcon, UsersIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Event } from "@/database/types";
import { Link } from "@/lib/i18n/navigation";

type EventTileProps = {
  event: Event;
  signupCount?: number;
};

function formatDate(date: Date | null | undefined, locale: string) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventTile({ event, signupCount = 0 }: EventTileProps) {
  const t = useTranslations("homePage.eventTile");
  const locale = useLocale();
  const spotsTotal = event.maxVolunteers ?? 0;
  const spotsLeft = spotsTotal - signupCount;
  const pct = spotsTotal > 0 ? Math.round((signupCount / spotsTotal) * 100) : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-lg">
      <Link className="block" href={`/events/${event.id}`}>
        <div className="relative h-52 overflow-hidden">
          <Image
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            height={400}
            src={event.imageUrl || "/placeholder.svg"}
            width={600}
          />
          <span className="absolute top-4 left-4 rounded-full bg-card/90 px-3 py-1 font-medium text-foreground text-xs backdrop-blur">
            {event.theme}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="grow">
          <Link className="block" href={`/events/${event.id}`}>
            <h3 className="font-semibold font-serif text-foreground text-xl">
              {event.title}
            </h3>
          </Link>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-muted-foreground text-sm">
          <span className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-primary" />
            {formatDate(event.startDate, locale)}
          </span>
          <span className="flex items-center gap-2">
            <MapPinIcon className="size-4 text-primary" />
            {event.address}
          </span>
        </div>

        {spotsTotal > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <UsersIcon className="size-3.5" />
                {t("signedUp", { count: signupCount })}
              </span>
              <span className="font-medium text-muted-foreground">
                {t("spotsLeft", { count: spotsLeft })}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <Button className="mt-5 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          {t("signUp")}
        </Button>
      </div>
    </article>
  );
}
