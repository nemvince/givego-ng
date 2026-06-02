"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BuildingsIcon,
  FingerprintIcon,
  UserIcon,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { saveProfile } from "@/app/[locale]/auth/register/complete/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

type AccountType = "person" | "organization";

const ORG_STEP = 2;

export const RegisterCompleteForm = () => {
  const t = useTranslations("auth.register.complete");
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  const totalSteps = accountType === "organization" ? 3 : 2;
  const passkeyStep = totalSteps;

  const orgFormSchema = z.object({
    orgName: z.string().min(1),
    registrationNumber: z.string().min(1),
    contactName: z.string().min(1),
    contactPhone: z.string().min(1),
    website: z.string().url().optional().or(z.literal("")),
  });

  type OrgFormData = z.infer<typeof orgFormSchema>;

  const orgForm = useForm<OrgFormData>({
    resolver: zodResolver(orgFormSchema),
    defaultValues: {
      orgName: "",
      registrationNumber: "",
      contactName: "",
      contactPhone: "",
      website: "",
    },
  });

  const onSelectAccountType = async (type: AccountType) => {
    setAccountType(type);
    if (type === "person") {
      const result = await saveProfile({ accountType: "person" });
      if (!result.success) {
        toast.error(result.error ?? t("error"));
        return;
      }
    }
    setStep(type === "organization" ? ORG_STEP : passkeyStep);
  };

  const onSubmitOrgDetails = async (data: OrgFormData) => {
    const result = await saveProfile({
      accountType: "organization",
      ...data,
    });
    if (!result.success) {
      toast.error(result.error ?? t("error"));
      return;
    }
    setStep(passkeyStep);
  };

  const onSetupPasskey = async () => {
    const { error } = await authClient.passkey.addPasskey();

    if (!error) {
      toast.success(t("passkey.success"));
      router.push("/");
      return;
    }

    toast.error(error.message ?? t("passkey.skip"));
  };

  const onSkipPasskey = () => {
    router.push("/");
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        return (
          <div
            className={`h-2 w-8 rounded-full transition-colors ${
              stepNumber <= step ? "bg-primary" : "bg-muted"
            }`}
            key={`step-indicator-${stepNumber}`}
          />
        );
      })}
    </div>
  );

  const stepLabel = (
    <p className="text-center text-muted-foreground text-sm">
      {t("step", { current: step, total: totalSteps })}
    </p>
  );

  // Step 1: Account type selection
  if (step === 1) {
    return (
      <Card className="overflow-hidden p-0">
        <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              {stepIndicator}
              {stepLabel}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold text-2xl">{t("accountType.title")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("accountType.description")}
                </p>
              </div>
              <div className="grid gap-4">
                <button
                  className="flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent"
                  onClick={() => onSelectAccountType("person")}
                  type="button"
                >
                  <UserIcon className="h-8 w-8 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {t("accountType.person.label")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t("accountType.person.description")}
                    </p>
                  </div>
                </button>
                <button
                  className="flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent"
                  onClick={() => onSelectAccountType("organization")}
                  type="button"
                >
                  <BuildingsIcon className="h-8 w-8 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {t("accountType.organization.label")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t("accountType.organization.description")}
                    </p>
                  </div>
                </button>
              </div>
            </FieldGroup>
          </div>
          <div className="relative hidden bg-muted md:block">
            <Image
              alt="Registration illustration"
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

  // Step 2: Org details (only for organizations)
  if (step === ORG_STEP && accountType === "organization") {
    return (
      <Card className="overflow-hidden p-0">
        <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            id="org-details-form"
            onSubmit={orgForm.handleSubmit(onSubmitOrgDetails)}
          >
            <FieldGroup>
              {stepIndicator}
              {stepLabel}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold text-2xl">{t("orgDetails.title")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("orgDetails.description")}
                </p>
              </div>
              <Controller
                control={orgForm.control}
                name="orgName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="org-form-name">
                      {t("orgDetails.orgName.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="org-form-name"
                      placeholder={t("orgDetails.orgName.placeholder")}
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
                control={orgForm.control}
                name="registrationNumber"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="org-form-reg-number">
                      {t("orgDetails.registrationNumber.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="org-form-reg-number"
                      placeholder={t(
                        "orgDetails.registrationNumber.placeholder"
                      )}
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
                control={orgForm.control}
                name="contactName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="org-form-contact-name">
                      {t("orgDetails.contactName.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="name"
                      id="org-form-contact-name"
                      placeholder={t("orgDetails.contactName.placeholder")}
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
                control={orgForm.control}
                name="contactPhone"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="org-form-phone">
                      {t("orgDetails.contactPhone.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="tel"
                      id="org-form-phone"
                      placeholder={t("orgDetails.contactPhone.placeholder")}
                      required
                      type="tel"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={orgForm.control}
                name="website"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="org-form-website">
                      {t("orgDetails.website.label")}
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="org-form-website"
                      placeholder={t("orgDetails.website.placeholder")}
                      type="url"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit">{t("continue")}</Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              alt="Registration illustration"
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

  // Step 3 (or 2 for person): Passkey setup
  if (step === passkeyStep) {
    return (
      <Card className="overflow-hidden p-0">
        <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              {stepIndicator}
              {stepLabel}
              <div className="flex flex-col items-center gap-4 text-center">
                <FingerprintIcon className="h-16 w-16 text-muted-foreground" />
                <h1 className="font-bold text-2xl">{t("passkey.title")}</h1>
                <p className="text-balance text-muted-foreground">
                  {t("passkey.description")}
                </p>
              </div>
              <Field>
                <Button
                  className="w-full"
                  onClick={onSetupPasskey}
                  type="button"
                >
                  {t("passkey.setup")}
                </Button>
              </Field>
              <Field>
                <Button
                  className="w-full"
                  onClick={onSkipPasskey}
                  type="button"
                  variant="ghost"
                >
                  {t("passkey.skip")}
                </Button>
              </Field>
            </FieldGroup>
          </div>
          <div className="relative hidden bg-muted md:block">
            <Image
              alt="Registration illustration"
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

  return null;
};
