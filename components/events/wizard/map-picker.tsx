"use client";

import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./map-inner"), { ssr: false });

type MapPickerProps = {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
};

export function MapPicker({ value, onChange }: MapPickerProps) {
  return <MapInner onChange={onChange} value={value} />;
}
