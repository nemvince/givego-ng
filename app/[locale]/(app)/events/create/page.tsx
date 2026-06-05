import { EventWizard } from "@/components/events/wizard/event-wizard";
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";
import { requireOrgOrRedirect } from "@/lib/auth/guards";
import { getTagsForLocale } from "./actions";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CreateEventPage({ params }: PageProps) {
  const { locale } = await params;
  await requireOrgOrRedirect();

  const tags = await getTagsForLocale(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <BreadcrumbTrail
        items={[
          { href: "/", isTranslationKey: true, label: "navigation.home" },
          { href: "/events", isTranslationKey: true, label: "events.title" },
          { isTranslationKey: true, label: "events.create.title" },
        ]}
      />
      <EventWizard tags={tags} />
    </div>
  );
}
