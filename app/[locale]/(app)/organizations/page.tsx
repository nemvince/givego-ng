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
    <div className="mx-auto w-full max-w-5xl p-6">
      <div className="flex flex-row items-center justify-between">
        <BreadcrumbTrail
          className="w-auto pt-0"
          items={[
            { href: "/", isTranslationKey: true, label: "navigation.home" },
            { isTranslationKey: true, label: "organizations.title" },
          ]}
        />
      </div>
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
