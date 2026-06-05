"use client";

import { CalendarIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  label: string;
};

export function DatePicker({ value, onChange, label }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className="flex h-9 w-full items-center justify-between rounded-4xl border border-input bg-input/30 px-3 py-1 text-base outline-none transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
        render={<Button variant="outline" />}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? value.toLocaleDateString() : label}
        </span>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setOpen(false);
            }
          }}
          selected={value ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
