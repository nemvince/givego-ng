"use client";

import { StarIcon, TrashIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GalleryFile = {
  key: string;
  name: string;
  previewUrl: string;
};

type GalleryImagePreviewProps = {
  files: GalleryFile[];
  mainKey: string | undefined;
  onRemove: (key: string) => void;
  onSetMain: (key: string) => void;
};

export function GalleryImagePreview({
  files,
  mainKey,
  onRemove,
  onSetMain,
}: GalleryImagePreviewProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file) => {
        const isMain = file.key === mainKey;

        return (
          <div
            className={cn(
              "group relative size-20 overflow-hidden rounded-lg border",
              isMain && "ring-2 ring-primary ring-offset-1"
            )}
            key={file.key}
          >
            <Image
              alt={file.name}
              className="object-cover"
              fill
              sizes="80px"
              src={file.previewUrl}
              unoptimized
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                aria-label="Set as main image"
                className={cn(
                  "size-7 rounded-full",
                  isMain
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-white hover:text-yellow-300"
                )}
                onClick={() => onSetMain(file.key)}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <StarIcon
                  className="size-4"
                  weight={isMain ? "fill" : "regular"}
                />
              </Button>
              <Button
                aria-label={`Remove ${file.name}`}
                className="text-white hover:text-red-400"
                onClick={() => onRemove(file.key)}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
