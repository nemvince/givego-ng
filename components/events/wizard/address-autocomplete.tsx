"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type PhotonFeature = {
  properties: {
    name: string;
    city?: string;
    country?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

type AddressAutocompleteProps = {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
};

export function AddressAutocomplete({
  value,
  onChange,
}: AddressAutocompleteProps) {
  const t = useTranslations("events.create.locationTime");
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`
      );
      if (!res.ok) {
        throw new Error("Photon API error");
      }
      const data = await res.json();
      setResults(data.features ?? []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (feature: PhotonFeature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const label = [
      feature.properties.name,
      feature.properties.city,
      feature.properties.country,
    ]
      .filter(Boolean)
      .join(", ");
    setQuery(label);
    onChange(label, lat, lng);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Input
        onChange={handleInputChange}
        placeholder={t("addressPlaceholder")}
        type="text"
        value={query}
      />
      {isOpen && (
        // leaflet's popup container has z-index 1000, so we use 1001 here to ensure it appears above
        <div className="absolute z-[1001] mt-1 w-full rounded-xl border bg-popover p-1 shadow-lg">
          {isSearching && (
            <p className="px-3 py-2 text-muted-foreground text-sm">
              {t("addressSearching")}
            </p>
          )}
          {!isSearching && results.length === 0 && (
            <p className="px-3 py-2 text-muted-foreground text-sm">
              {t("addressNoResults")}
            </p>
          )}
          {results.map((feature) => {
            const [lng, lat] = feature.geometry.coordinates;
            const label = [
              feature.properties.name,
              feature.properties.city,
              feature.properties.country,
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
                key={`${lat}-${lng}-${label}`}
                onClick={() => handleSelect(feature)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
