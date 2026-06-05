"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

const TOTAL_STEPS = 4;

const STEP_KEYS = [
  "basicInfo",
  "locationTime",
  "volunteers",
  "review",
] as const;

type EventWizardLayoutProps = {
  step: number;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function EventWizardLayout({
  step,
  headingRef,
  children,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: EventWizardLayoutProps) {
  const t = useTranslations("events.create");

  const stepIndicator = (
    <fieldset
      aria-label={t("stepIndicator", { current: step, total: TOTAL_STEPS })}
      className="flex items-center justify-center gap-2"
    >
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNumber = i + 1;
        return (
          <div
            aria-label={t(`steps.${STEP_KEYS[i]}`)}
            className={`h-2 w-8 rounded-full transition-colors ${
              stepNumber <= step ? "bg-primary" : "bg-muted"
            }`}
            key={`step-indicator-${stepNumber}`}
            role="img"
          />
        );
      })}
    </fieldset>
  );

  const stepLabel = (
    <p className="text-center text-muted-foreground text-sm">
      {t("stepIndicator", { current: step, total: TOTAL_STEPS })}
    </p>
  );

  const isLastStep = step === TOTAL_STEPS;

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-6 md:p-8">
        <FieldGroup>
          {stepIndicator}
          {stepLabel}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-bold text-2xl" ref={headingRef} tabIndex={-1}>
              {t(`steps.${STEP_KEYS[step - 1]}`)}
            </h1>
          </div>
          <div aria-live="polite" className="sr-only">
            {t("stepIndicator", { current: step, total: TOTAL_STEPS })}
          </div>
          {children}
          <div className="flex items-center justify-between gap-4">
            {step > 1 ? (
              <Button onClick={onBack} type="button" variant="ghost">
                {t("navigation.back")}
              </Button>
            ) : (
              <div />
            )}
            {isLastStep ? (
              <Button disabled={isSubmitting} onClick={onSubmit} type="button">
                {isSubmitting ? t("review.submitting") : t("navigation.submit")}
              </Button>
            ) : (
              <Button onClick={onNext} type="button">
                {t("navigation.next")}
              </Button>
            )}
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
