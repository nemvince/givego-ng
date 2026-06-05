"use client";

import { FadersHorizontal, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { EventTile } from "@/components/events/event-tile";
import { Button } from "@/components/ui/button";
import {
  type Event,
  type HelpMode,
  helpModes,
  type WorkType,
  workTypes,
} from "@/database/types";

type EventRow = {
  event: Event;
  signupCount: number;
};

type SortKey = "soonest" | "spots" | "popular";

function matchesFilters(
  e: Event,
  q: string,
  activeThemes: string[],
  activeWorkTypes: WorkType[],
  activeHelpModes: HelpMode[],
  recurringOnly: boolean,
  availableOnly: boolean,
  eventsData: EventRow[]
): boolean {
  if (q) {
    const haystack =
      `${e.title} ${e.description} ${e.theme} ${e.address}`.toLowerCase();
    if (!haystack.includes(q)) {
      return false;
    }
  }
  if (activeThemes.length && !activeThemes.includes(e.theme)) {
    return false;
  }
  if (
    activeWorkTypes.length &&
    !activeWorkTypes.includes(e.workType as WorkType)
  ) {
    return false;
  }
  if (
    activeHelpModes.length &&
    !activeHelpModes.includes(e.helpMode as HelpMode)
  ) {
    return false;
  }
  if (recurringOnly && !e.isRecurring) {
    return false;
  }
  if (availableOnly && e.maxVolunteers != null) {
    const row = eventsData.find((r) => r.event.id === e.id);
    if (row && row.signupCount >= e.maxVolunteers) {
      return false;
    }
  }
  return true;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 font-medium text-sm transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2.5 font-mono text-muted-foreground text-xs uppercase tracking-widest">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function EventsExplorer({
  eventsData,
  themes,
}: {
  eventsData: EventRow[];
  themes: string[];
}) {
  const t = useTranslations("events.browse");
  const tWorkTypes = useTranslations("events.create.basicInfo.workTypes");
  const tHelpModes = useTranslations("events.create.volunteers.helpModes");

  const [query, setQuery] = useState("");
  const [activeThemes, setActiveThemes] = useState<string[]>([]);
  const [activeWorkTypes, setActiveWorkTypes] = useState<WorkType[]>([]);
  const [activeHelpModes, setActiveHelpModes] = useState<HelpMode[]>([]);
  const [recurringOnly, setRecurringOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("soonest");
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "soonest", label: t("sort.soonest") },
    { key: "spots", label: t("sort.mostSpots") },
    { key: "popular", label: t("sort.mostPopular") },
  ];

  const toggle = <T,>(value: T, list: T[], setter: (v: T[]) => void) => {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  const clearAll = () => {
    setQuery("");
    setActiveThemes([]);
    setActiveWorkTypes([]);
    setActiveHelpModes([]);
    setRecurringOnly(false);
    setAvailableOnly(false);
  };

  const activeCount =
    activeThemes.length +
    activeWorkTypes.length +
    activeHelpModes.length +
    (recurringOnly ? 1 : 0) +
    (availableOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = eventsData.filter(({ event: e }) =>
      matchesFilters(
        e,
        q,
        activeThemes,
        activeWorkTypes,
        activeHelpModes,
        recurringOnly,
        availableOnly,
        eventsData
      )
    );

    return [...filtered].sort((a, b) => {
      if (sort === "soonest") {
        const aDate = a.event.startDate ? +new Date(a.event.startDate) : 0;
        const bDate = b.event.startDate ? +new Date(b.event.startDate) : 0;
        return aDate - bDate;
      }
      if (sort === "spots") {
        const aSpots = (a.event.maxVolunteers ?? 0) - a.signupCount;
        const bSpots = (b.event.maxVolunteers ?? 0) - b.signupCount;
        return bSpots - aSpots;
      }
      return b.signupCount - a.signupCount;
    });
  }, [
    query,
    activeThemes,
    activeWorkTypes,
    activeHelpModes,
    recurringOnly,
    availableOnly,
    sort,
    eventsData,
  ]);

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <FilterGroup label={t("filters.cause")}>
        {themes.map((theme) => (
          <FilterChip
            active={activeThemes.includes(theme)}
            key={theme}
            onClick={() => toggle(theme, activeThemes, setActiveThemes)}
          >
            {theme}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label={t("filters.typeOfWork")}>
        {workTypes.map((w) => (
          <FilterChip
            active={activeWorkTypes.includes(w)}
            key={w}
            onClick={() => toggle(w, activeWorkTypes, setActiveWorkTypes)}
          >
            {tWorkTypes(w)}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label={t("filters.format")}>
        {helpModes.map((h) => (
          <FilterChip
            active={activeHelpModes.includes(h)}
            key={h}
            onClick={() => toggle(h, activeHelpModes, setActiveHelpModes)}
          >
            {tHelpModes(h)}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label={t("filters.other")}>
        <FilterChip
          active={recurringOnly}
          onClick={() => setRecurringOnly((v) => !v)}
        >
          {t("filters.recurring")}
        </FilterChip>
        <FilterChip
          active={availableOnly}
          onClick={() => setAvailableOnly((v) => !v)}
        >
          {t("filters.spotsAvailable")}
        </FilterChip>
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="sticky top-16 z-20 -mx-5 bg-background/80 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              aria-label={t("search.placeholder")}
              className="h-12 w-full rounded-full border border-border bg-card pr-4 pl-11 text-foreground text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              type="search"
              value={query}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="h-12 rounded-full border-border bg-card lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
              type="button"
              variant="outline"
            >
              <FadersHorizontal className="size-4" />
              {t("filters.title")}
              {activeCount > 0 && (
                <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {activeCount}
                </span>
              )}
            </Button>
            <label className="sr-only" htmlFor="sort">
              {t("sort.label")}
            </label>
            <select
              className="h-12 rounded-full border border-border bg-card px-4 text-foreground text-sm outline-none focus:border-primary"
              id="sort"
              onChange={(e) => setSort(e.target.value as SortKey)}
              value={sort}
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {t("sort.label")}: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold font-serif text-foreground text-lg">
                {t("filters.title")}
              </h2>
              {activeCount > 0 && (
                <button
                  className="font-medium text-accent text-xs hover:underline"
                  onClick={clearAll}
                  type="button"
                >
                  {t("filters.clearAll")}
                </button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        {showFilters && (
          <div className="rounded-3xl border border-border bg-card p-5 lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold font-serif text-foreground text-lg">
                {t("filters.title")}
              </h2>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button
                    className="font-medium text-accent text-xs hover:underline"
                    onClick={clearAll}
                    type="button"
                  >
                    {t("filters.clearAll")}
                  </button>
                )}
                <button
                  aria-label={t("filters.closeFilters")}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setShowFilters(false)}
                  type="button"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            {filterPanel}
          </div>
        )}

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="text-muted-foreground text-sm">
              {t("results.count", { count: results.length })}
            </p>
            {activeCount > 0 && (
              <button
                className="ml-auto hidden items-center gap-1 font-medium text-accent text-xs hover:underline lg:inline-flex"
                onClick={clearAll}
                type="button"
              >
                <X className="size-3.5" />
                {t("filters.resetFilters")}
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map(({ event, signupCount }) => (
                <EventTile
                  event={event}
                  key={event.id}
                  signupCount={signupCount}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border border-dashed bg-card/50 px-6 py-20 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
                <MagnifyingGlass className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold font-serif text-foreground text-xl">
                {t("results.noResults.title")}
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground text-sm">
                {t("results.noResults.description")}
              </p>
              <Button
                className="mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={clearAll}
                type="button"
              >
                {t("results.noResults.clearButton")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
