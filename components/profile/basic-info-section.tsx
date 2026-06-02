"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import type { Session } from "@/lib/auth/types";

export function BasicInfoSection({ session }: { session: Session }) {
  const t = useTranslations("profile.basicInfo");
  const [isSaving, setIsSaving] = useState(false);

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session.user.name ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      await authClient.updateUser({ name: data.name });
      toast.success(t("saved"));
    } catch {
      toast.error("Failed to update name");
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
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t("name.label")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder={t("name.placeholder")}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <FieldLabel>{t("email.label")}</FieldLabel>
              <Input disabled value={session.user.email} />
              <p className="text-muted-foreground text-xs">
                {t("email.changeHint")}
              </p>
            </Field>
            <Field>
              <FieldLabel>{t("accountType.label")}</FieldLabel>
              <div>
                <Badge variant="outline">{t("accountType.person")}</Badge>
              </div>
            </Field>
            <Field>
              <FieldLabel>{t("emailVerified")}</FieldLabel>
              <div>
                {session.user.emailVerified ? (
                  <Badge variant="default">Verified</Badge>
                ) : (
                  <Badge variant="secondary">{t("emailNotVerified")}</Badge>
                )}
              </div>
            </Field>
            <Button disabled={isSaving} type="submit">
              {isSaving ? t("saving") : t("save")}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
