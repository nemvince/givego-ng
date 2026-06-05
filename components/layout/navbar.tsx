"use client";

import {
  BellIcon,
  ListIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth/client";
import type { Session } from "@/lib/auth/types";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";

type Notification = {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Date;
};

export function Navbar({
  session,
  notifications = [],
  unreadCount = 0,
}: {
  session: Session | null;
  notifications?: Notification[];
  unreadCount?: number;
}) {
  const t = useTranslations("navbar");
  const tNotif = useTranslations("notifications");
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!session?.user;

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/events", label: t("events") },
    { href: "/organizations", label: t("organizations") },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-2.5">
        <div className="md:hidden">
          <Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
            <SheetTrigger
              aria-label={t("mobileNav.open")}
              render={
                <Button size="icon-sm" variant="ghost">
                  <ListIcon className="size-5" />
                </Button>
              }
            />
            <SheetContent className="w-72" showCloseButton side="left">
              <SheetHeader className="sr-only">
                <SheetTitle>{t("mobileNav.title")}</SheetTitle>
                <SheetDescription>{t("mobileNav.close")}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <Link
                  className="font-bold text-lg"
                  href="/"
                  onClick={() => setMobileOpen(false)}
                >
                  GiveGo
                </Link>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      className={`rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
                        isActive(link.href)
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      }`}
                      href={link.href}
                      key={link.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                {isAuthenticated && (
                  <>
                    <div className="h-px bg-border" />
                    <Button
                      className="w-full justify-start"
                      onClick={handleSignOut}
                      variant="ghost"
                    >
                      {t("signOut")}
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link className="font-bold text-lg" href="/">
          GiveGo
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              className={`rounded-lg px-3 py-1.5 font-medium text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-8 w-48 pl-8"
                disabled
                placeholder={t("searchPlaceholder")}
              />
            </div>
          </div>

          {isAuthenticated ? (
            <>
              <Popover>
                <PopoverTrigger
                  aria-label={tNotif("title")}
                  render={
                    <Button className="relative" size="icon-sm" variant="ghost">
                      <BellIcon className="size-5" />
                      {unreadCount > 0 && (
                        <Badge
                          className="absolute -top-1 -right-1 size-4 justify-center rounded-full p-0 text-[10px]"
                          variant="destructive"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  }
                />
                <PopoverContent align="end" className="w-80" sideOffset={8}>
                  <PopoverHeader>
                    <PopoverTitle>{tNotif("title")}</PopoverTitle>
                  </PopoverHeader>
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <BellIcon className="size-8 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        {tNotif("empty")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {notifications.map((notif) => (
                        <div
                          className={`flex gap-3 rounded-lg p-2 ${
                            notif.isRead ? "" : "bg-primary/5"
                          }`}
                          key={notif.id}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notif.title}</p>
                            <p className="line-clamp-1 text-muted-foreground text-xs">
                              {notif.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button className="size-8 rounded-full" variant="ghost">
                      <Avatar size="sm">
                        <AvatarImage src={session.user.image ?? undefined} />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) ?? (
                            <UserIcon className="size-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
                <DropdownMenuContent
                  align="end"
                  className="w-56"
                  sideOffset={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="font-medium text-foreground">
                        {session.user.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {session.user.email}
                      </p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/profile" />}>
                    {t("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleSignOut}
                  >
                    {t("signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                nativeButton={false}
                render={<Link href="/auth/login" />}
                size="sm"
                variant="outline"
              >
                {t("login")}
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/auth/register" />}
                size="sm"
              >
                {t("register")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
