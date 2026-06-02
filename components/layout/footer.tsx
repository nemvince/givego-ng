"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 text-muted-foreground text-sm">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        <nav className="flex gap-4">
          <Link
            className="transition-colors hover:text-foreground"
            href="/terms"
          >
            {t("terms")}
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/privacy"
          >
            {t("privacy")}
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/about"
          >
            {t("about")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
