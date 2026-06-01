"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogoIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ComponentProps, type ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth/client";

const AuthButton = (
  props: {
    onClick: () => void;
    name: string;
    srName: string;
    icon: ReactNode;
  } & ComponentProps<typeof Button>
) => {
  const { onClick, icon, name, srName, ...rest } = props;
  return (
    <Button
      {...rest}
      className="flex w-full items-center gap-2"
      onClick={onClick}
      type="button"
      variant="outline"
    >
      {icon}
      <span>{name}</span>
      <span className="sr-only">{srName}</span>
    </Button>
  );
};

export const RegisterForm = () => {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const registerFormSchema = z
    .object({
      name: z.string().min(1, t("name.label")),
      email: z.email(t("email.invalid")),
      password: z.string().min(8, t("password.tooShort")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("confirmPassword.mismatch"),
      path: ["confirmPassword"],
    });

  type RegisterFormData = z.infer<typeof registerFormSchema>;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onPasswordRegister = async (data: RegisterFormData) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!error) {
      setOtpEmail(data.email);
      toast.success(t("otpSent"));
      return;
    }

    if (error.status === 422) {
      toast.error(t("errors.emailAlreadyExists"));
    } else if (error.status === 429) {
      toast.error(t("errors.tooManyRequests"));
    } else {
      toast.error(error.message ?? t("errors.unknown"));
    }
  };

  const onVerifyOtp = async () => {
    if (otp.length !== 6 || !otpEmail) {
      return;
    }

    setIsVerifying(true);
    const { error } = await authClient.emailOtp.verifyEmail({
      email: otpEmail,
      otp,
    });

    if (!error) {
      setIsRedirecting(true);
      toast.success(t("otpVerified"));
      router.push("/auth/register/complete");
      return;
    }

    toast.error(error.message ?? t("errors.unknown"));
    setIsVerifying(false);
  };

  const onResendOtp = async () => {
    if (!otpEmail) {
      return;
    }

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: otpEmail,
      type: "email-verification",
    });

    if (!error) {
      toast.success(t("otpSent"));
      return;
    }

    toast.error(error.message ?? t("errors.unknown"));
  };

  const onGoogleRegister = () => {
    console.log("Google register");
  };

  const { isSubmitting, errors } = form.formState;

  let verifyButtonText = t("verify");
  if (isVerifying) {
    verifyButtonText = t("verifying");
  }
  if (isRedirecting) {
    verifyButtonText = t("redirecting");
  }

  if (otpEmail) {
    return (
      <Card className="overflow-hidden p-0">
        <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold text-2xl">{t("verifyEmail")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("otpDescription", { email: otpEmail })}
                </p>
              </div>
              <Field>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    onChange={setOtp}
                    onComplete={() => {
                      onVerifyOtp();
                    }}
                    value={otp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </Field>
              <Field>
                <Button
                  className="w-full"
                  disabled={isVerifying || isRedirecting || otp.length !== 6}
                  onClick={onVerifyOtp}
                  type="button"
                >
                  {verifyButtonText}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                {t("noCode")}{" "}
                <button
                  className="underline underline-offset-2"
                  onClick={() => onResendOtp()}
                  type="button"
                >
                  {t("resend")}
                </button>
              </FieldDescription>
            </FieldGroup>
          </div>
          <div className="relative hidden bg-muted md:block">
            <Image
              alt="Register illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              height={400}
              src="/placeholder.svg"
              width={400}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
        <form
          className="p-6 md:p-8"
          id="register-form"
          onSubmit={form.handleSubmit(onPasswordRegister)}
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="font-bold text-2xl">{t("createAccount")}</h1>
              <p className="text-balance text-muted-foreground">
                {t("getStarted")}
              </p>
            </div>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-name">
                    {t("name.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="name"
                    id="register-form-name"
                    placeholder={t("name.placeholder")}
                    required
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-email">
                    {t("email.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="email"
                    id="register-form-email"
                    placeholder={t("email.placeholder")}
                    required
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-password">
                    {t("password.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    id="register-form-password"
                    required
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-confirm-password">
                    {t("confirmPassword.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    id="register-form-confirm-password"
                    required
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              {errors.root && <FieldError errors={[errors.root]} />}
              <Button disabled={isSubmitting} type="submit">
                {t("submit")}
              </Button>
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              {t("orContinueWith")}
            </FieldSeparator>
            <Field>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="inline-block w-fit">
                      <AuthButton
                        disabled
                        icon={<GoogleLogoIcon className="h-4 w-4" />}
                        name={t("google")}
                        onClick={onGoogleRegister}
                        srName={t("googleSr")}
                      />
                    </span>
                  }
                />
                <TooltipContent side="bottom">
                  {t("notAvailable")}
                </TooltipContent>
              </Tooltip>
            </Field>
            <FieldDescription className="text-center">
              {t("hasAccount")} <Link href="/auth/login">{t("logIn")}</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
        <div className="relative hidden bg-muted md:block">
          <Image
            alt="Register illustration"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            height={400}
            src="/placeholder.svg"
            width={400}
          />
        </div>
      </CardContent>
    </Card>
  );
};
