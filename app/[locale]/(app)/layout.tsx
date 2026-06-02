import { and, desc, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { db } from "@/database";
import { notifications } from "@/database/schema/notification";
import { auth } from "@/lib/auth/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  let notifs: Array<{
    id: number;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: Date;
  }> = [];
  if (session?.user) {
    notifs = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        title: notifications.title,
        body: notifications.body,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
      })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, session.user.id),
          isNull(notifications.deletedAt)
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(10);
  }

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <AppShell
      notifications={notifs}
      session={session}
      unreadCount={unreadCount}
    >
      {children}
    </AppShell>
  );
}
