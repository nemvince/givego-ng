"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { softDeleteAccount } from "@/app/[locale]/(app)/profile/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "@/lib/i18n/navigation";

export function DangerZoneSection({ userName }: { userName: string }) {
  const t = useTranslations("profile.dangerZone");
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    const result = await softDeleteAccount();
    if (result.success) {
      toast.success(t("success"));
      await authClient.signOut();
      router.push("/auth/login");
    } else {
      toast.error(result.error ?? "Failed to delete account");
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive">{t("deleteAccount")}</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {t("confirmText", { name: userName })}
              </p>
              <Input
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={userName}
                value={confirmText}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={confirmText !== userName}
                onClick={handleDelete}
              >
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
