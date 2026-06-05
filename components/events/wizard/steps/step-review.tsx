"use client";

import { useUploadFiles } from "@better-upload/client";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { EventWizardData } from "@/components/events/wizard/schemas/event-wizard";
import { GalleryImagePreview } from "@/components/events/wizard/steps/gallery-image-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

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

  const [galleryFiles, setGalleryFiles] = useState<
    { key: string; name: string; previewUrl: string }[]
  >([]);
  const blobUrlsRef = useRef<Set<string>>(new Set());

  const revokeBlobUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url);
    blobUrlsRef.current.delete(url);
  }, []);

  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const imageUploader = useUploadFiles({
    route: "images",
    onUploadComplete: ({ files }) => {
      const existingKeys = form.getValues("galleryImageKeys") ?? [];
      const existingKeySet = new Set(existingKeys);

      const addedFiles = files.filter(
        (file) => !existingKeySet.has(file.objectInfo.key)
      );
      if (addedFiles.length === 0) {
        return;
      }

      const newKeys = addedFiles.map((file) => file.objectInfo.key);
      form.setValue("galleryImageKeys", [...existingKeys, ...newKeys]);

      const newGalleryFiles = addedFiles.map((file) => ({
        key: file.objectInfo.key,
        name: file.name,
        previewUrl: URL.createObjectURL(file.raw),
      }));
      for (const f of newGalleryFiles) {
        blobUrlsRef.current.add(f.previewUrl);
      }

      setGalleryFiles((prev) => [...prev, ...newGalleryFiles]);

      const mainKey = form.getValues("galleryMainImageKey");
      if (!mainKey) {
        form.setValue("galleryMainImageKey", newKeys[0]);
      }
    },
    onError: (error) => {
      form.setError("galleryImageKeys", {
        message: error.message || "An error occurred.",
      });
    },
  });

  const handleRemoveImage = useCallback(
    (key: string) => {
      const file = galleryFiles.find((f) => f.key === key);
      if (file) {
        revokeBlobUrl(file.previewUrl);
      }

      const updated = galleryFiles.filter((f) => f.key !== key);
      setGalleryFiles(updated);
      form.setValue(
        "galleryImageKeys",
        updated.map((f) => f.key)
      );

      const mainKey = form.getValues("galleryMainImageKey");
      if (mainKey === key) {
        form.setValue("galleryMainImageKey", updated[0]?.key ?? undefined);
      }
    },
    [galleryFiles, form, revokeBlobUrl]
  );

  const handleSetMainImage = useCallback(
    (key: string) => {
      form.setValue("galleryMainImageKey", key);
    },
    [form]
  );

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
            {!values.isRecurring && values.startTime && (
              <>
                <dt className="font-medium text-muted-foreground">
                  {t("startTime")}
                </dt>
                <dd>{values.startTime}</dd>
              </>
            )}
            {!values.isRecurring && values.endTime && (
              <>
                <dt className="font-medium text-muted-foreground">
                  {t("endTime")}
                </dt>
                <dd>{values.endTime}</dd>
              </>
            )}
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
          <div className="flex flex-col gap-3">
            <Controller
              control={form.control}
              name="galleryImageKeys"
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-medium text-sm">
                    {t("imageUpload")}
                  </FieldLabel>
                  <UploadDropzone
                    accept="image/*"
                    control={imageUploader.control}
                    description={{
                      maxFiles: 5,
                      maxFileSize: "5MB",
                      fileTypes: "JPEG, PNG, GIF",
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <GalleryImagePreview
              files={galleryFiles}
              mainKey={form.getValues("galleryMainImageKey")}
              onRemove={handleRemoveImage}
              onSetMain={handleSetMainImage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
