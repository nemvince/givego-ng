"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Passkey, Profile, UserSettings } from "@/database/types";
import type { Session } from "@/lib/auth/types";
import { AccountSection } from "./account-section";
import { BasicInfoSection } from "./basic-info-section";
import { DangerZoneSection } from "./danger-zone-section";
import { PreferencesSection } from "./preferences-section";
import { ProfileDetailsSection } from "./profile-details-section";
import { SecuritySection } from "./security-section";

export function ProfileForm({
  session,
  profile,
  settings,
  passkeys,
}: {
  session: Session;
  profile: Profile | null;
  settings: UserSettings | null;
  passkeys: Passkey[];
}) {
  const t = useTranslations("profile");

  return (
    <Tabs defaultValue="basic-info" orientation="horizontal">
      <TabsList
        className="w-full justify-start gap-2 rounded-none border-b"
        variant="line"
      >
        <TabsTrigger value="basic-info">{t("tabs.basicInfo")}</TabsTrigger>
        <TabsTrigger value="profile-details">
          {t("tabs.profileDetails")}
        </TabsTrigger>
        <TabsTrigger value="account">{t("tabs.account")}</TabsTrigger>
        <TabsTrigger value="security">{t("tabs.security")}</TabsTrigger>
        <TabsTrigger value="preferences">{t("tabs.preferences")}</TabsTrigger>
        <TabsTrigger value="danger-zone">{t("tabs.dangerZone")}</TabsTrigger>
      </TabsList>
      <TabsContent value="basic-info">
        <BasicInfoSection session={session} />
      </TabsContent>
      <TabsContent value="profile-details">
        <ProfileDetailsSection profile={profile} />
      </TabsContent>
      <TabsContent value="account">
        <AccountSection session={session} />
      </TabsContent>
      <TabsContent value="security">
        <SecuritySection passkeys={passkeys} />
      </TabsContent>
      <TabsContent value="preferences">
        <PreferencesSection settings={settings} />
      </TabsContent>
      <TabsContent value="danger-zone">
        <DangerZoneSection userName={session.user.name} />
      </TabsContent>
    </Tabs>
  );
}
