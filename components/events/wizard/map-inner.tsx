"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapClickHandler({
  onChange,
}: {
  onChange: (coords: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });
  return null;
}

function MapController({
  center,
}: {
  center: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [map, center]);

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return null;
}

type MapInnerProps = {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
};

export default function MapInner({ value, onChange }: MapInnerProps) {
  const center = value ?? { lat: 47.4979, lng: 19.0402 };

  return (
    <div className="h-[300px] w-full overflow-hidden rounded-xl border">
      <MapContainer
        center={center}
        className="h-full w-full"
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onChange={onChange} />
        <MapController center={value} />
        {value && <Marker position={value} />}
      </MapContainer>
    </div>
  );
}
