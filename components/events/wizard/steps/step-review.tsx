"use client";

import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import type { EventWizardData } from "@/components/events/wizard/schemas/event-wizard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

type Tag = { id: number; name: string };

type StepReviewProps = {
  form: UseFormReturn<EventWizardData>;
  tags: Tag[];
  onStepBack: (step: number) => void;
};

export function StepReview({ form, tags, onStepBack }: StepReviewProps) {
  const t = useTranslations("events.create.review");
  const tWorkTypes = useTranslations("events.create.basicInfo.workTypes");
  const tHelpModes = useTranslations("events.create.volunteers.helpModes");
  const tWeekdays = useTranslations("events.create.locationTime.weekdays");

  const values = form.getValues();
  const selectedTags = tags.filter((tag) => values.tagIds.includes(tag.id));

  const formatWorkType = (wt: string) => {
    const map: Record<string, string> = {
      physical: tWorkTypes("physical"),
      social: tWorkTypes("social"),
      office: tWorkTypes("office"),
    };
    return map[wt] ?? wt;
  };

  const formatHelpMode = (hm: string) => {
    const map: Record<string, string> = {
      online: tHelpModes("online"),
      personal: tHelpModes("personal"),
      hybrid: tHelpModes("hybrid"),
    };
    return map[hm] ?? hm;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return "—";
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("sectionBasic")}</CardTitle>
            <Button
              onClick={() => onStepBack(1)}
              size="sm"
              type="button"
              variant="ghost"
            >
              {t("back", { step: 1 })}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="font-medium text-muted-foreground">Title</dt>
            <dd>{values.title || "—"}</dd>
            <dt className="font-medium text-muted-foreground">Theme</dt>
            <dd>{values.theme || "—"}</dd>
            <dt className="font-medium text-muted-foreground">Work type</dt>
            <dd>{formatWorkType(values.workType)}</dd>
            <dt className="font-medium text-muted-foreground">Description</dt>
            <dd className="whitespace-pre-wrap">{values.description || "—"}</dd>
            <dt className="font-medium text-muted-foreground">Tags</dt>
            <dd className="flex flex-wrap gap-1">
              {selectedTags.length > 0
                ? selectedTags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))
                : "—"}
            </dd>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("sectionLocation")}</CardTitle>
            <Button
              onClick={() => onStepBack(2)}
              size="sm"
              type="button"
              variant="ghost"
            >
              {t("back", { step: 2 })}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="font-medium text-muted-foreground">Address mode</dt>
            <dd>
              {values.addressMode === "autocomplete"
                ? t("searchableAddress")
                : t("freeTextAddress")}
            </dd>
            <dt className="font-medium text-muted-foreground">Address</dt>
            <dd>{values.address || "—"}</dd>
            {values.addressMode === "autocomplete" &&
              values.latitude != null && (
                <>
                  <dt className="font-medium text-muted-foreground">
                    Coordinates
                  </dt>
                  <dd>
                    {values.latitude.toFixed(5)}, {values.longitude?.toFixed(5)}
                  </dd>
                </>
              )}
            <dt className="font-medium text-muted-foreground">Start date</dt>
            <dd>{formatDate(values.startDate)}</dd>
            <dt className="font-medium text-muted-foreground">End date</dt>
            <dd>{formatDate(values.endDate)}</dd>
            <dt className="font-medium text-muted-foreground">Recurrence</dt>
            <dd>
              {values.isRecurring ? (
                <div className="flex flex-col gap-1">
                  <span>{t("recurringEvent")}</span>
                  {values.weekdays && values.weekdays.length > 0 && (
                    <span>
                      {values.weekdays
                        .map((d) => tWeekdays(WEEKDAY_KEYS[d]))
                        .join(", ")}
                    </span>
                  )}
                  {values.timeslots &&
                    values.timeslots.length > 0 &&
                    values.timeslots.map((ts) => (
                      <span key={`${ts.start}-${ts.end}`}>
                        {ts.start} – {ts.end}
                      </span>
                    ))}
                </div>
              ) : (
                t("oneTimeEvent")
              )}
            </dd>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("sectionVolunteers")}</CardTitle>
            <Button
              onClick={() => onStepBack(3)}
              size="sm"
              type="button"
              variant="ghost"
            >
              {t("back", { step: 3 })}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="font-medium text-muted-foreground">Help mode</dt>
            <dd>{formatHelpMode(values.helpMode)}</dd>
            <dt className="font-medium text-muted-foreground">
              Min volunteers
            </dt>
            <dd>{values.minVolunteers ?? t("noMinVolunteers")}</dd>
            <dt className="font-medium text-muted-foreground">
              Max volunteers
            </dt>
            <dd>{values.maxVolunteers ?? t("noMaxVolunteers")}</dd>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-medium text-sm">{t("imageUpload")}</p>
            <p className="text-muted-foreground text-sm">
              {t("imagePlaceholder")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
