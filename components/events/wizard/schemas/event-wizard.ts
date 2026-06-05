import { z } from "zod";
import { helpModeEnum, workTypeEnum } from "@/database/schema/event";

const timeslotSchema = z.object({
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
});

const eventWizardObject = z.object({
  title: z.string().min(1, "Title is required").max(200),
  theme: z.string().min(1, "Theme is required"),
  workType: z.enum(workTypeEnum.enumValues),
  description: z.string().min(1, "Description is required"),
  tagIds: z.array(z.number().int()).min(1, "Select at least one tag"),

  addressMode: z.enum(["autocomplete", "text"]),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  startDate: z.date({ message: "Start date is required" }).optional(),
  endDate: z.date({ message: "End date is required" }).optional(),
  isRecurring: z.boolean(),
  weekdays: z.array(z.number().int().min(0).max(6)).optional(),
  timeslots: z.array(timeslotSchema).optional(),

  helpMode: z.enum(helpModeEnum.enumValues),
  minVolunteers: z.number().int().positive().nullable().optional(),
  maxVolunteers: z.number().int().positive().nullable().optional(),
  galleryImageKeys: z.array(z.string()).optional(),
  galleryMainImageKey: z.string().optional(),
});

export const eventWizardSchema = eventWizardObject
  .refine(
    (data) =>
      !(data.minVolunteers && data.maxVolunteers) ||
      data.minVolunteers <= data.maxVolunteers,
    {
      message: "Minimum volunteers cannot exceed maximum",
      path: ["maxVolunteers"],
    }
  )
  .refine(
    (data) =>
      !(data.endDate && data.startDate) || data.endDate >= data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => !data.isRecurring || (data.weekdays && data.weekdays.length > 0),
    { message: "Select at least one weekday", path: ["weekdays"] }
  )
  .refine(
    (data) =>
      !data.isRecurring || (data.timeslots && data.timeslots.length > 0),
    { message: "Add at least one time slot", path: ["timeslots"] }
  );

export type EventWizardData = z.infer<typeof eventWizardSchema>;

export const step1Schema = eventWizardObject.pick({
  title: true,
  theme: true,
  workType: true,
  description: true,
  tagIds: true,
});

export const step2Schema = eventWizardObject.pick({
  addressMode: true,
  address: true,
  latitude: true,
  longitude: true,
  startDate: true,
  endDate: true,
  isRecurring: true,
  weekdays: true,
  timeslots: true,
});

export const step3Schema = eventWizardObject.pick({
  helpMode: true,
  minVolunteers: true,
  maxVolunteers: true,
});
