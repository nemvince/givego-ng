import { Hero } from "@/components/home/hero";
import { HighlightedEvents } from "@/components/home/highlighted-events";
import { HowItWorks } from "@/components/home/how-it-works";
import { OrganizerCta } from "@/components/home/organizer-cta";

export default function HomePage() {
  return (
    <div className="flex grow flex-col">
      <Hero />
      <HowItWorks />
      <HighlightedEvents />
      <OrganizerCta />
    </div>
  );
}
