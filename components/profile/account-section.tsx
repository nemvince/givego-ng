"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth/client";
import type { Session } from "@/lib/auth/types";

export function AccountSection({ session }: { session: Session }) {
  const t = useTranslations("profile.account");
  const [otpStep, setOtpStep] = useState<"idle" | "otp">("idle");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(8),
      newPassword: z.string().min(8),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("password.confirm.mismatch"),
      path: ["confirmPassword"],
    });

  type PasswordFormData = z.infer<typeof passwordSchema>;

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleRequestEmailChange = async () => {
    if (!newEmail) {
      return;
    }
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: newEmail,
        type: "change-email",
      });
      setOtpStep("otp");
      toast.success(t("email.enterOtp", { email: newEmail }));
    } catch {
      toast.error(t("email.error"));
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!otp) {
      return;
    }
    if (!newEmail) {
      return;
    }
    try {
      await authClient.emailOtp.changeEmail({
        newEmail,
        otp,
      });
      toast.success(t("email.success"));
      setOtpStep("idle");
      setNewEmail("");
      setOtp("");
    } catch {
      toast.error(t("email.error"));
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: false,
      });
      toast.success(t("password.success"));
      passwordForm.reset();
    } catch {
      toast.error(t("password.error"));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("email.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>{t("email.currentEmail")}</FieldLabel>
              <Input disabled value={session.user.email} />
            </Field>
            {otpStep === "idle" ? (
              <>
                <Field>
                  <FieldLabel>{t("email.newEmail.label")}</FieldLabel>
                  <Input
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder={t("email.newEmail.placeholder")}
                    type="email"
                    value={newEmail}
                  />
                </Field>
                <Button onClick={handleRequestEmailChange}>
                  {t("email.requestChange")}
                </Button>
              </>
            ) : (
              <>
                <Field>
                  <FieldLabel>
                    {t("email.enterOtp", { email: newEmail })}
                  </FieldLabel>
                  <InputOTP maxLength={6} onChange={setOtp} value={otp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>
                <Button onClick={handleVerifyEmailChange}>
                  {t("email.verify")}
                </Button>
              </>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("password.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
            <FieldGroup>
              <Controller
                control={passwordForm.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{t("password.current.label")}</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={passwordForm.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{t("password.new.label")}</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{t("password.confirm.label")}</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type="submit">{t("password.submit")}</Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
