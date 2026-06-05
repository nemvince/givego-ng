"use client";

import {
  CalendarCheckIcon,
  HandHeartIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

const stepIcons = [
  MagnifyingGlassIcon,
  CalendarCheckIcon,
  HandHeartIcon,
] as const;

export function HowItWorks() {
  const t = useTranslations("homePage.howItWorks");

  return (
    <section className="bg-primary text-primary-foreground" id="how">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-primary-foreground/70 text-xs uppercase tracking-widest">
            {t("label")}
          </p>
          <h2 className="mt-2 text-balance font-semibold font-serif text-4xl tracking-tight sm:text-5xl">
            {t("heading")}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {["step1", "step2", "step3"].map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div className="flex flex-col gap-4" key={step}>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary-foreground/10">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-semibold font-serif text-2xl text-primary-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-semibold font-serif text-xl">
                  {t(`${step}.title`)}
                </h3>
                <p className="text-primary-foreground/75 text-sm leading-relaxed">
                  {t(`${step}.body`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
