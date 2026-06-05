import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { db } from "@/database";
import { events as eventsTable } from "@/database/schema/event";
import { requireOrg } from "@/lib/auth/guards";
import { Link } from "@/lib/i18n/navigation";
import { CalendarCheckIcon, PlusIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";

export default async function EventsPage() {
  const t = await getTranslations("events");
  const { session } = await requireOrg();
  const isOrg = !!session?.user;

  const events = await db.select().from(eventsTable);

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <div className="flex flex-row items-start justify-between">
        <BreadcrumbTrail
          className="w-auto pt-0"
          items={[
            { href: "/", isTranslationKey: true, label: "navigation.home" },
            { isTranslationKey: true, label: "events.title" },
          ]}
        />
        {isOrg && (
          <Button nativeButton={false} render={<Link href="/events/create" />}>
            <PlusIcon className="size-4" />
            {t("create.title")}
          </Button>
        )}
      </div>
      {events.length === 0 && (
        <Empty className="py-20">
          <EmptyMedia variant="icon">
            <CalendarCheckIcon className="size-10" />
          </EmptyMedia>
          <EmptyTitle>{t("title")}</EmptyTitle>
          <EmptyDescription>{t("comingSoon")}</EmptyDescription>
        </Empty>
      )}
      {events.map((event) => (
        <div className="" key={event.id}>
          {event.title}
        </div>
      ))}
    </div>
  );
}
