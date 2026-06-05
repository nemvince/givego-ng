"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("homePage.hero");

  return (
    <section>
      <div className="mx-auto max-w-5xl px-5 pt-14 pb-12 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-semibold font-serif text-5xl text-foreground leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            {t.rich("heading", {
              highlight: (chunks) => (
                <span className="text-primary">{chunks}</span>
              ),
            })}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            className="group w-full rounded-full bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90 sm:w-auto"
            nativeButton={false}
            render={
              <Link href="/events">
                {t("cta")}
                <ArrowRightIcon className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
            size="lg"
          />
        </div>
      </div>
    </section>
  );
}
