"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn, useWatch } from "react-hook-form";
import { AddressAutocomplete } from "@/components/events/wizard/address-autocomplete";
import { DatePicker } from "@/components/events/wizard/date-picker";
import { MapPicker } from "@/components/events/wizard/map-picker";
import { RecurrenceBuilder } from "@/components/events/wizard/recurrence-builder";
import type { EventWizardData } from "@/components/events/wizard/schemas/event-wizard";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

type StepLocationTimeProps = {
  form: UseFormReturn<EventWizardData>;
};

export function StepLocationTime({ form }: StepLocationTimeProps) {
  const t = useTranslations("events.create.locationTime");
  const addressMode = useWatch({ control: form.control, name: "addressMode" });
  const isRecurring = useWatch({ control: form.control, name: "isRecurring" });
  const timeslots = useWatch({ control: form.control, name: "timeslots" });

  const handleAddressSelect = (address: string, lat?: number, lng?: number) => {
    form.setValue("address", address, { shouldDirty: true });
    if (lat !== undefined) {
      form.setValue("latitude", lat, { shouldDirty: true });
    }
    if (lng !== undefined) {
      form.setValue("longitude", lng, { shouldDirty: true });
    }
  };

  const handleMapChange = (coords: { lat: number; lng: number }) => {
    form.setValue("latitude", coords.lat, { shouldDirty: true });
    form.setValue("longitude", coords.lng, { shouldDirty: true });
    fetch(
      `https://photon.komoot.io/reverse?lat=${coords.lat}&lon=${coords.lng}&lang=en`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const displayName = feature.properties.name;
          const city = feature.properties.city;
          const country = feature.properties.country;
          const fullAddress = [displayName, city, country]
            .filter(Boolean)
            .join(", ");
          console.log("Reverse geocoded address:", fullAddress);
          form.setValue("address", fullAddress, { shouldDirty: true });
        }
      })
      .catch(() => {
        // ignore errors and keep the original address
      });
  };

  const handleModeChange = (mode: "autocomplete" | "text") => {
    form.setValue("addressMode", mode, { shouldDirty: true });
    if (mode === "text") {
      form.setValue("latitude", null, { shouldDirty: true });
      form.setValue("longitude", null, { shouldDirty: true });
    }
  };

  return (
    <FieldGroup>
      <Controller
        control={form.control}
        name="addressMode"
        render={({ field }) => (
          <Field>
            <FieldLabel>{t("addressModeLabel")}</FieldLabel>
            <RadioGroup
              onValueChange={(value) =>
                handleModeChange(value as "autocomplete" | "text")
              }
              value={field.value}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="mode-autocomplete" value="autocomplete" />
                <label className="text-sm" htmlFor="mode-autocomplete">
                  {t("addressModeAutocomplete")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="mode-text" value="text" />
                <label className="text-sm" htmlFor="mode-text">
                  {t("addressModeText")}
                </label>
              </div>
            </RadioGroup>
          </Field>
        )}
      />

      {addressMode === "autocomplete" ? (
        <>
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t("addressLabel")}</FieldLabel>
                <AddressAutocomplete
                  onChange={handleAddressSelect}
                  value={field.value}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t("mapLabel")}</FieldLabel>
                <p className="text-muted-foreground text-sm">{t("mapHint")}</p>
                <MapPicker
                  onChange={handleMapChange}
                  value={
                    field.value != null && form.getValues("longitude") != null
                      ? {
                          lat: field.value,
                          lng: form.getValues("longitude") as number,
                        }
                      : null
                  }
                />
              </Field>
            )}
          />
        </>
      ) : (
        <Controller
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address-text">
                {t("addressTextLabel")}
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="address-text"
                placeholder={t("addressTextPlaceholder")}
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}

      <Controller
        control={form.control}
        name="isRecurring"
        render={({ field }) => (
          <Field>
            <div className="flex items-center gap-3">
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  form.setValue("isRecurring", checked, { shouldDirty: true });
                  if (checked) {
                    form.setValue("timeslots", [{ start: "", end: "" }], {
                      shouldDirty: true,
                    });
                  } else {
                    form.setValue("weekdays", [], { shouldDirty: true });
                    form.setValue("timeslots", [], { shouldDirty: true });
                  }
                }}
              />
              <FieldLabel>{t("isRecurringLabel")}</FieldLabel>
            </div>
          </Field>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="startDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                {isRecurring ? t("dateRangeStartLabel") : t("startDateLabel")}
              </FieldLabel>
              <DatePicker
                label={t("pickDate")}
                onChange={(date) => {
                  field.onChange(date);
                  const endDate = form.getValues("endDate");
                  if (
                    (endDate && date && endDate < date) ||
                    endDate === undefined ||
                    Number.isNaN(endDate.getTime())
                  ) {
                    form.setValue("endDate", date, { shouldDirty: true });
                  }
                }}
                value={field.value ?? null}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="endDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                {isRecurring ? t("dateRangeEndLabel") : t("endDateLabel")}
              </FieldLabel>
              <DatePicker
                label={t("pickDate")}
                onChange={(date) => field.onChange(date)}
                value={field.value ?? null}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {!isRecurring && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="startTime"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="start-time">
                  {t("startTimeLabel")}
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="start-time"
                  type="time"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="endTime"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="end-time">{t("endTimeLabel")}</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="end-time"
                  type="time"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}

      {isRecurring && (
        <Controller
          control={form.control}
          name="weekdays"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t("weekdaysLabel")}</FieldLabel>
              <RecurrenceBuilder
                onTimeslotsChange={(timeslots) =>
                  form.setValue("timeslots", timeslots, { shouldDirty: true })
                }
                onWeekdaysChange={(weekdays) => field.onChange(weekdays)}
                timeslots={timeslots ?? []}
                weekdays={field.value ?? []}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </FieldGroup>
  );
}
