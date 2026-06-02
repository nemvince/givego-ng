"use client";

import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { Session } from "@/lib/auth/types";

type Notification = {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
};

export function AppShell({
  session,
  notifications = [],
  unreadCount = 0,
  children,
}: {
  session: Session | null;
  notifications?: Notification[];
  unreadCount?: number;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar
        notifications={notifications}
        session={session}
        unreadCount={unreadCount}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
