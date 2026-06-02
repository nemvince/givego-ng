import { BuildingsIcon } from "@phosphor-icons/react/ssr";
import { getTranslations } from "next-intl/server";
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function OrganizationsPage() {
  const t = await getTranslations("organizations");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <BreadcrumbTrail
        items={[
          { href: "/", isTranslationKey: true, label: "navigation.home" },
          { isTranslationKey: true, label: "organizations.title" },
        ]}
      />
      <Empty className="py-20">
        <EmptyMedia variant="icon">
          <BuildingsIcon className="size-10" />
        </EmptyMedia>
        <EmptyTitle>{t("title")}</EmptyTitle>
        <EmptyDescription>{t("comingSoon")}</EmptyDescription>
      </Empty>
    </div>
  );
}
