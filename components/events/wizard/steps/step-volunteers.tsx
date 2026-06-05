"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { EventWizardData } from "@/components/events/wizard/schemas/event-wizard";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type StepVolunteersProps = {
  form: UseFormReturn<EventWizardData>;
};

export function StepVolunteers({ form }: StepVolunteersProps) {
  const t = useTranslations("events.create.volunteers");

  return (
    <FieldGroup>
      <Controller
        control={form.control}
        name="helpMode"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{t("helpModeLabel")}</FieldLabel>
            <RadioGroup
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="help-online" value="online" />
                <label className="text-sm" htmlFor="help-online">
                  {t("helpModes.online")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="help-personal" value="personal" />
                <label className="text-sm" htmlFor="help-personal">
                  {t("helpModes.personal")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="help-hybrid" value="hybrid" />
                <label className="text-sm" htmlFor="help-hybrid">
                  {t("helpModes.hybrid")}
                </label>
              </div>
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="minVolunteers"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="min-volunteers">
                {t("minVolunteersLabel")}
              </FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                id="min-volunteers"
                min={1}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? null : Number(val));
                }}
                placeholder={t("minVolunteersPlaceholder")}
                type="number"
                value={field.value ?? ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="maxVolunteers"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="max-volunteers">
                {t("maxVolunteersLabel")}
              </FieldLabel>
              <Input
                aria-invalid={fieldState.invalid}
                id="max-volunteers"
                min={1}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? null : Number(val));
                }}
                placeholder={t("maxVolunteersPlaceholder")}
                type="number"
                value={field.value ?? ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  );
}
