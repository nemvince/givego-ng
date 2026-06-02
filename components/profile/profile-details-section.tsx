"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateProfile } from "@/app/[locale]/(app)/profile/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "@/database/types";

export function ProfileDetailsSection({
  profile,
}: {
  profile: Profile | null;
}) {
  const t = useTranslations("profile.profileDetails");
  const [isSaving, setIsSaving] = useState(false);

  const schema = z.object({
    description: z.string().max(500).optional(),
    website: z.string().url().or(z.literal("")).optional(),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    showContactName: z.boolean().optional(),
    showContactPhone: z.boolean().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: profile?.description ?? "",
      website: profile?.website ?? "",
      contactName: profile?.contactName ?? "",
      contactPhone: profile?.contactPhone ?? "",
      showContactName: profile?.showContactName ?? true,
      showContactPhone: profile?.showContactPhone ?? true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success(t("saved"));
      } else {
        toast.error(result.error ?? "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("description.label")}</FieldLabel>
                  <Textarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder={t("description.placeholder")}
                    rows={4}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="website"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("website.label")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder={t("website.placeholder")}
                    type="url"
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="contactName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("contactName.label")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder={t("contactName.placeholder")}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="contactPhone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("contactPhone.label")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder={t("contactPhone.placeholder")}
                    type="tel"
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="showContactName"
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FieldLabel>{t("showContactName")}</FieldLabel>
                  </div>
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="showContactPhone"
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FieldLabel>{t("showContactPhone")}</FieldLabel>
                  </div>
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
            <Button disabled={isSaving} type="submit">
              {isSaving ? t("saving") : t("save")}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
