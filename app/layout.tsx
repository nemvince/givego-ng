import "@/app/globals.css";
import { Fraunces, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const fontSerif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      className={cn(
        "antialiased",
        "font-sans",
        "h-dvh",
        fontMono.variable,
        fontSans.variable,
        fontSerif.variable
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
