"use client";

import { useTranslations } from "next-intl";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { EventWizardData } from "@/components/events/wizard/schemas/event-wizard";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Tag = { id: number; name: string };

type StepBasicInfoProps = {
  form: UseFormReturn<EventWizardData>;
  tags: Tag[];
};

export function StepBasicInfo({ form, tags }: StepBasicInfoProps) {
  const t = useTranslations("events.create.basicInfo");
  const anchor = useComboboxAnchor();

  return (
    <FieldGroup>
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="event-title">{t("titleLabel")}</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              id="event-title"
              placeholder={t("titlePlaceholder")}
              required
              type="text"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="theme"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="event-theme">{t("themeLabel")}</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              id="event-theme"
              placeholder={t("themePlaceholder")}
              required
              type="text"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="workType"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{t("workTypeLabel")}</FieldLabel>
            <Select
              items={[
                { value: "physical", label: t("workTypes.physical") },
                { value: "social", label: t("workTypes.social") },
                { value: "office", label: t("workTypes.office") },
              ]}
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder={t("workTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">
                  {t("workTypes.physical")}
                </SelectItem>
                <SelectItem value="social">{t("workTypes.social")}</SelectItem>
                <SelectItem value="office">{t("workTypes.office")}</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="event-description">
              {t("descriptionLabel")}
            </FieldLabel>
            <Textarea
              {...field}
              aria-invalid={fieldState.invalid}
              id="event-description"
              placeholder={t("descriptionPlaceholder")}
              required
              rows={4}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="tagIds"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{t("tagsLabel")}</FieldLabel>
            <Combobox
              items={tags}
              multiple
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <ComboboxChips ref={anchor}>
                {field.value.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return (
                    <ComboboxChip key={tagId} showRemove>
                      {tag?.name ?? String(tagId)}
                    </ComboboxChip>
                  );
                })}
                <ComboboxChipsInput
                  placeholder={
                    field.value.length === 0 ? t("tagsPlaceholder") : ""
                  }
                />
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>{t("tagsEmpty")}</ComboboxEmpty>
                <ComboboxList>
                  <ComboboxCollection>
                    {(tag: Tag) => (
                      <ComboboxItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
