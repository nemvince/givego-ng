"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { updateSettings } from "@/app/[locale]/(app)/profile/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import type { UserSettings } from "./types";

export function PreferencesSection({
  settings,
}: {
  settings: UserSettings | null;
}) {
  const t = useTranslations("profile.preferences");
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [optimistic, addOptimistic] = useOptimistic(
    {
      emailNotifications: settings?.emailNotifications ?? true,
      inAppNotifications: settings?.inAppNotifications ?? true,
    },
    (state, update: { key: string; value: boolean }) => ({
      ...state,
      [update.key]: update.value,
    })
  );

  const handleToggle = async (key: string, value: boolean) => {
    startTransition(() => {
      addOptimistic({ key, value });
    });
    const result = await updateSettings({ [key]: value });
    if (!result.success) {
      toast.error("Failed to update");
    }
  };

  const getThemeLabel = () => {
    if (theme === "light") {
      return "Light";
    }
    if (theme === "dark") {
      return "Dark";
    }
    return "System";
  };

  const cycleTheme = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme ?? "system");
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "hu" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("notifications.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field className="flex flex-row items-center justify-between rounded-lg border p-3">
            <FieldLabel>{t("notifications.email")}</FieldLabel>
            <Switch
              checked={optimistic.emailNotifications}
              onCheckedChange={(value) =>
                handleToggle("emailNotifications", value)
              }
            />
          </Field>
          <Field className="flex flex-row items-center justify-between rounded-lg border p-3">
            <FieldLabel>{t("notifications.inApp")}</FieldLabel>
            <Switch
              checked={optimistic.inAppNotifications}
              onCheckedChange={(value) =>
                handleToggle("inAppNotifications", value)
              }
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Field className="flex flex-row items-center justify-between rounded-lg border p-3">
            <FieldLabel>{t("appearance.label")}</FieldLabel>
            <Button onClick={cycleTheme} size="sm" variant="outline">
              {getThemeLabel()}
            </Button>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("language.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Field className="flex flex-row items-center justify-between rounded-lg border p-3">
            <FieldLabel>{t("language.label")}</FieldLabel>
            <Button onClick={toggleLocale} size="sm" variant="outline">
              {locale === "en" ? "English" : "Magyar"}
            </Button>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
