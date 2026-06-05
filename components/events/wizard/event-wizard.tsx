"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { type FieldPath, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { EventWizardLayout } from "@/components/events/wizard/event-wizard-layout";
import { useWizardDraft } from "@/components/events/wizard/hooks/use-wizard-draft";
import { useWizardFocus } from "@/components/events/wizard/hooks/use-wizard-focus";
import {
  type EventWizardData,
  eventWizardSchema,
} from "@/components/events/wizard/schemas/event-wizard";

type Tag = { id: number; name: string };

type EventWizardProps = {
  tags: Tag[];
};

const STEP_FIELDS: Record<number, (keyof EventWizardData)[]> = {
  1: ["title", "theme", "workType", "description", "tagIds"],
  2: [
    "addressMode",
    "address",
    "latitude",
    "longitude",
    "startDate",
    "endDate",
    "startTime",
    "endTime",
    "isRecurring",
  ],
  3: ["helpMode", "minVolunteers", "maxVolunteers"],
};

function getErrorStep(issues: { path: PropertyKey[] }[]): number {
  const firstPath = String(issues[0]?.path[0] ?? "");
  for (const [step, fields] of Object.entries(STEP_FIELDS)) {
    if (fields.includes(firstPath as keyof EventWizardData)) {
      return Number(step);
    }
  }
  return 1;
}

export function EventWizard({ tags }: EventWizardProps) {
  const t = useTranslations("events.create");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveDraft, loadDraft, clearDraft, isResuming } = useWizardDraft();
  const headingRef = useWizardFocus(step);

  const form = useForm<EventWizardData>({
    resolver: zodResolver(eventWizardSchema) as Resolver<EventWizardData>,
    defaultValues: {
      title: "",
      theme: "",
      workType: "physical",
      description: "",
      tagIds: [],
      addressMode: "autocomplete",
      address: "",
      latitude: null,
      longitude: null,
      startDate: undefined as unknown as Date,
      endDate: undefined as unknown as Date,
      startTime: "",
      endTime: "",
      isRecurring: false,
      weekdays: [],
      timeslots: [],
      helpMode: "personal",
      minVolunteers: null,
      maxVolunteers: null,
      galleryImageKeys: [],
      galleryMainImageKey: undefined,
    },
  });

  useEffect(() => {
    const draft = loadDraft();
    if (draft && !isResuming.current) {
      isResuming.current = true;
      form.reset(draft.data as EventWizardData);
      setStep(draft.step);
      toast.success(t("draft.restored"));
    }
  }, [loadDraft, form, isResuming, t]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  const validateStep = useCallback(
    (currentStep: number): Promise<boolean> => {
      const fields = STEP_FIELDS[currentStep];
      if (!fields) {
        return Promise.resolve(true);
      }
      return form.trigger(fields);
    },
    [form]
  );

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      saveDraft(step, form.getValues());
      setStep((s) => Math.min(s + 1, 4));
    }
  }, [step, validateStep, saveDraft, form]);

  const handleBack = useCallback(() => {
    saveDraft(step, form.getValues());
    setStep((s) => Math.max(s - 1, 1));
  }, [step, saveDraft, form]);

  const handleSubmit = useCallback(async () => {
    const data = form.getValues();
    const parsed = eventWizardSchema.safeParse(data);
    if (!parsed.success) {
      form.clearErrors();
      for (const issue of parsed.error.issues) {
        form.setError(issue.path.join(".") as FieldPath<EventWizardData>, {
          message: issue.message,
        });
      }
      const errorStep = getErrorStep(parsed.error.issues);
      if (step !== errorStep) {
        setStep(errorStep);
      }
      return;
    }
    setIsSubmitting(true);
    try {
      const { createEvent } = await import(
        "@/app/[locale]/(app)/events/create/actions"
      );
      const result = await createEvent(data);
      if (result.success) {
        clearDraft();
        toast.success(t("success"));
        router.push("/");
      } else {
        toast.error(result.error ?? t("errors.serverError"));
      }
    } catch {
      toast.error(t("errors.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [step, form, clearDraft, t, router]);

  const handleStepBack = useCallback(
    (targetStep: number) => {
      saveDraft(step, form.getValues());
      setStep(targetStep);
    },
    [step, saveDraft, form]
  );

  return (
    <EventWizardLayout
      headingRef={headingRef}
      isSubmitting={isSubmitting}
      onBack={handleBack}
      onNext={handleNext}
      onSubmit={handleSubmit}
      step={step}
    >
      {step === 1 && <StepBasicInfo form={form} tags={tags} />}
      {step === 2 && <StepLocationTime form={form} />}
      {step === 3 && <StepVolunteers form={form} />}
      {step === 4 && (
        <StepReview form={form} onStepBack={handleStepBack} tags={tags} />
      )}
    </EventWizardLayout>
  );
}

import { StepBasicInfo } from "@/components/events/wizard/steps/step-basic-info";
import { StepLocationTime } from "@/components/events/wizard/steps/step-location-time";
import { StepReview } from "@/components/events/wizard/steps/step-review";
import { StepVolunteers } from "@/components/events/wizard/steps/step-volunteers";
