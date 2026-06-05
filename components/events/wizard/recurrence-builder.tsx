"use client";

import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const WEEKDAY_INDICES = [0, 1, 2, 3, 4, 5, 6] as const;
const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

type Timeslot = { start: string; end: string };

type RecurrenceBuilderProps = {
  weekdays: number[];
  timeslots: Timeslot[];
  onWeekdaysChange: (weekdays: number[]) => void;
  onTimeslotsChange: (timeslots: Timeslot[]) => void;
};

export function RecurrenceBuilder({
  weekdays,
  timeslots,
  onWeekdaysChange,
  onTimeslotsChange,
}: RecurrenceBuilderProps) {
  const t = useTranslations("events.create.locationTime");
  const idPrefix = useId();
  const keyCounter = useRef(timeslots.length);

  const getKey = (index: number) => `${idPrefix}-${index}`;

  const handleAddTimeslot = () => {
    keyCounter.current += 1;
    onTimeslotsChange([...timeslots, { start: "", end: "" }]);
  };

  const handleRemoveTimeslot = (index: number) => {
    onTimeslotsChange(timeslots.filter((_, i) => i !== index));
  };

  const handleTimeslotChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updated = timeslots.map((ts, i) =>
      i === index ? { ...ts, [field]: value } : ts
    );
    onTimeslotsChange(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        multiple
        onValueChange={(value) => onWeekdaysChange(value.map(Number))}
        value={weekdays.map(String)}
        variant="outline"
      >
        {WEEKDAY_INDICES.map((i) => (
          <ToggleGroupItem key={i} value={String(i)}>
            {t(`weekdays.${WEEKDAY_KEYS[i]}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex flex-col gap-3">
        {timeslots.map((ts, index) => (
          <div className="flex items-center gap-3" key={getKey(index)}>
            <Input
              aria-label={t("timeslotStart")}
              className="flex-1"
              onChange={(e) =>
                handleTimeslotChange(index, "start", e.target.value)
              }
              type="time"
              value={ts.start}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              aria-label={t("timeslotEnd")}
              className="flex-1"
              onChange={(e) =>
                handleTimeslotChange(index, "end", e.target.value)
              }
              type="time"
              value={ts.end}
            />
            {timeslots.length > 1 && (
              <Button
                onClick={() => handleRemoveTimeslot(index)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <XIcon className="size-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={handleAddTimeslot}
          size="sm"
          type="button"
          variant="outline"
        >
          {t("addTimeslot")}
        </Button>
      </div>
    </div>
  );
}
