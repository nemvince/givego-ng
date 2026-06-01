"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FingerprintIcon, GoogleLogoIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ComponentProps, type ReactNode, useEffect } from "react";
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

export const LoginForm = () => {
  const t = useTranslations("auth.login");
  const router = useRouter();

  const loginFormSchema = z.object({
    email: z.email(t("email.invalid")),
    password: z.string().min(8, t("password.tooShort")),
  });

  type LoginFormData = z.infer<typeof loginFormSchema>;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Conditional UI: pre-load passkey autofill when the component mounts.
  // Stays pending until the user picks a passkey from the browser's autofill
  // dropdown or the page unmounts. Not related to the button click below.
  useEffect(() => {
    if (!PublicKeyCredential.isConditionalMediationAvailable?.()) {
      return;
    }

    authClient.signIn.passkey({
      autoFill: true,
      fetchOptions: {
        onSuccess() {
          router.push("/");
        },
      },
    });
  }, [router]);

  const onPasswordLogin = async (data: LoginFormData) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (!error) {
      router.push("/");
      return;
    }

    if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
      form.setError("root", { message: t("errors.invalidCredentials") });
    } else if (error.status === 403) {
      toast.error(t("errors.emailNotVerified"));
    } else if (error.status === 429) {
      toast.error(t("errors.tooManyRequests"));
    } else {
      toast.error(error.message ?? t("errors.unknown"));
    }
  };

  const onGoogleLogin = () => {
    console.log("Google login");
  };

  // Explicit button-click passkey sign-in. Does NOT use autoFill — that is
  // reserved for the Conditional UI useEffect above.
  const onPasskeyLogin = async () => {
    const { error } = await authClient.signIn.passkey();

    if (!error) {
      router.push("/");
      return;
    }

    if (error.status === 403) {
      toast.error(t("errors.emailNotVerified"));
    } else if (error.status === 429) {
      toast.error(t("errors.tooManyRequests"));
    } else {
      toast.error(error.message ?? t("errors.unknown"));
    }
  };

  const { isSubmitting, errors } = form.formState;

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
        <form
          className="p-6 md:p-8"
          id="login-form"
          onSubmit={form.handleSubmit(onPasswordLogin)}
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="font-bold text-2xl">{t("welcomeBack")}</h1>
              <p className="text-balance text-muted-foreground">
                {t("loginToAccount")}
              </p>
            </div>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email">
                    {t("email.label")}
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    // "webauthn" must be the last token — required for Conditional UI
                    autoComplete="email webauthn"
                    id="login-form-email"
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
                  <div className="flex items-center">
                    <FieldLabel htmlFor="login-form-password">
                      {t("password.label")}
                    </FieldLabel>
                    <Link
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                      href="/auth/forgot-password"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    // "webauthn" must be the last token — required for Conditional UI
                    autoComplete="current-password webauthn"
                    id="login-form-password"
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
            <Field className="grid grid-cols-2 gap-4">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="inline-block w-fit">
                      <AuthButton
                        disabled
                        icon={<GoogleLogoIcon className="h-4 w-4" />}
                        name={t("google")}
                        onClick={onGoogleLogin}
                        srName={t("googleSr")}
                      />
                    </span>
                  }
                />
                <TooltipContent side="bottom">
                  {t("notAvailable")}
                </TooltipContent>
              </Tooltip>
              <AuthButton
                icon={<FingerprintIcon className="h-4 w-4" />}
                name={t("passkey")}
                onClick={onPasskeyLogin}
                srName={t("passkeySr")}
              />
            </Field>
            <FieldDescription className="text-center">
              {t("noAccount")} <Link href="/auth/register">{t("signUp")}</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
        <div className="relative hidden bg-muted md:block">
          <Image
            alt="asd"
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
