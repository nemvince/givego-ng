import { getTranslations } from "next-intl/server";
import { BreadcrumbTrail } from "@/components/layout/breadcrumb-trail";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <BreadcrumbTrail
        items={[
          { href: "/", isTranslationKey: true, label: "navigation.home" },
          { isTranslationKey: true, label: "about.title" },
        ]}
      />
      <div className="space-y-4">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("placeholder")}</p>
      </div>
    </div>
  );
}
