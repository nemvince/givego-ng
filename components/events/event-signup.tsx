"use client";

import { UsersIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { signupForEvent } from "@/app/[locale]/(app)/events/[id]/actions";
import { Button } from "@/components/ui/button";
import type { Event } from "@/database/types";

type EventSignupProps = {
  event: Event;
  signupCount: number;
  currentUserId: string | null;
};

export function EventSignup({
  event,
  signupCount,
  currentUserId,
}: EventSignupProps) {
  const t = useTranslations("events.detail");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const isLoggedIn = currentUserId !== null;
  const isOwnEvent = currentUserId === event.organizerId;
  const isFull =
    event.maxVolunteers == null ? false : signupCount >= event.maxVolunteers;

  const handleSignup = () => {
    startTransition(async () => {
      if (!isLoggedIn) {
        router.push("/auth/login");
        return;
      }

      const result = await signupForEvent(event.id);
      if (result.success) {
        if (result.alreadySignedUp) {
          setMessage(t("alreadySignedUp"));
        } else {
          setMessage(t("signUpSuccess"));
          router.refresh();
        }
      } else {
        switch (result.error) {
          case "full":
            setMessage(t("signUpFull"));
            break;
          case "own_event":
            setMessage(t("signUpOwnEvent"));
            break;
          default:
            setMessage(t("signUpError"));
        }
      }
    });
  };

  let signupContent: React.ReactNode;

  if (isOwnEvent) {
    signupContent = (
      <Button className="mt-4 w-full rounded-full" disabled size="lg">
        {t("signUpOwnEvent")}
      </Button>
    );
  } else if (isFull) {
    signupContent = (
      <Button className="mt-4 w-full rounded-full" disabled size="lg">
        {t("signUpFull")}
      </Button>
    );
  } else if (isLoggedIn) {
    signupContent = (
      <>
        <Button
          className="mt-4 w-full rounded-full"
          disabled={isPending}
          onClick={handleSignup}
          size="lg"
        >
          {isPending ? t("signingUp") : t("signUp")}
        </Button>
        {message && (
          <p className="mt-2 text-center text-muted-foreground text-xs">
            {message}
          </p>
        )}
      </>
    );
  } else {
    signupContent = (
      <Button
        className="mt-4 w-full rounded-full"
        onClick={() => router.push("/auth/login")}
        size="lg"
      >
        {t("loginToSignUp")}
      </Button>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm">
        <UsersIcon className="size-4 text-primary" />
        {t("signUp")}
      </h3>
      <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
        {event.minVolunteers != null || event.maxVolunteers != null
          ? t("volunteerNeeds", {
              min: event.minVolunteers ?? 0,
              max: event.maxVolunteers ?? "—",
            })
          : t("noVolunteerLimit")}
      </p>
      {signupContent}
    </div>
  );
}
