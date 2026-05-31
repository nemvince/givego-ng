"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// This page renders when a route like `/unknown` is requested.
// In this case, the layout at `app/[locale]/layout.tsx` receives
// an invalid value as the `[locale]` param and calls `notFound()`.

export default function GlobalNotFound() {
  return (
    <main className="flex grow flex-col items-center justify-center gap-6 p-6">
      <h1 className="font-black text-6xl">404</h1>
      <p className="font-bold text-2xl">Az oldal nem található.</p>
      <Link href="/">
        <Button>Vissza a főoldalra</Button>
      </Link>
    </main>
  );
}
