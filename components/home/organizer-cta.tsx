"use client";

import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

const WIZARD_STEPS = ["step1", "step2", "step3", "step4"] as const;

export function OrganizerCta() {
  const t = useTranslations("homePage.organizerCta");

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8" id="organizers">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
              {t("label")}
            </p>
            <h2 className="mt-2 text-balance font-semibold font-serif text-4xl text-foreground tracking-tight sm:text-5xl">
              {t("heading")}
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              <li className="flex items-center gap-3 text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckIcon className="size-3" />
                </span>
                <span className="text-sm">{t("perk1")}</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckIcon className="size-3" />
                </span>
                <span className="text-sm">{t("perk2")}</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckIcon className="size-3" />
                </span>
                <span className="text-sm">{t("perk3")}</span>
              </li>
            </ul>
            <Link href="/events/create">
              <Button
                className="group mt-8 rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {t("cta")}
                <ArrowRightIcon className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>

          <div className="rounded-3xl bg-secondary p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="font-semibold font-serif text-foreground text-lg">
                {t("card.title")}
              </span>
              <span className="rounded-full bg-accent/15 px-3 py-1 font-medium text-muted-foreground text-xs">
                {t("card.badge")}
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {WIZARD_STEPS.map((step, i) => (
                <div
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  key={step}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full font-medium text-xs ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground text-sm">
                    {t(`card.${step}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
