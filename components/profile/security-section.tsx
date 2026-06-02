"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
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
import type { Passkey } from "./types";

export function SecuritySection({ passkeys }: { passkeys: Passkey[] }) {
  const t = useTranslations("profile.security");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddPasskey = async () => {
    try {
      await authClient.passkey.addPasskey();
      toast.success(t("addSuccess"));
    } catch {
      toast.error("Failed to add passkey");
    }
  };

  const handleDeletePasskey = async (id: string) => {
    try {
      await authClient.passkey.deletePasskey({ id });
      toast.success(t("deleteSuccess"));
    } catch {
      toast.error("Failed to delete passkey");
    }
  };

  const handleRenamePasskey = async (id: string) => {
    try {
      await authClient.passkey.updatePasskey({ id, name: editName });
      toast.success(t("renameSuccess"));
      setEditingId(null);
    } catch {
      toast.error("Failed to rename passkey");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {passkeys.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("noPasskeys")}</p>
        ) : (
          <div className="space-y-2">
            {passkeys.map((pk) => (
              <div
                className="flex items-center justify-between rounded-lg border p-3"
                key={pk.id}
              >
                <div className="flex-1">
                  {editingId === pk.id ? (
                    <div className="flex gap-2">
                      <Input
                        className="h-8"
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRenamePasskey(pk.id);
                          }
                        }}
                        value={editName}
                      />
                      <Button
                        onClick={() => handleRenamePasskey(pk.id)}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-sm">
                        {pk.name ?? t("unnamedPasskey")}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {pk.createdAt
                          ? new Date(pk.createdAt).toLocaleDateString()
                          : t("unknownDate")}
                      </p>
                    </>
                  )}
                </div>
                {editingId !== pk.id && (
                  <div className="flex gap-1">
                    <Button
                      onClick={() => {
                        setEditingId(pk.id);
                        setEditName(pk.name ?? "");
                      }}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeletePasskey(pk.id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <TrashIcon className="size-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Button onClick={handleAddPasskey} variant="outline">
          <PlusIcon className="mr-2 size-4" />
          {t("addPasskey")}
        </Button>
      </CardContent>
    </Card>
  );
}
