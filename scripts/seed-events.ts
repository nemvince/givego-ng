import { db } from "@/database";
import { user } from "@/database/schema/auth";
import { events, eventTags, tags } from "@/database/schema/event";

function picsum(seed: string, width = 800, height = 600) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

function galleryUrls(seed: string, count: number) {
  return JSON.stringify(
    Array.from({ length: count }, (_, i) =>
      picsum(`${seed}-${i + 1}`, 800, 600)
    )
  );
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

const seedEvents = [
  {
    title: "Riverside Park Cleanup",
    theme: "Environment",
    workType: "physical" as const,
    helpMode: "personal" as const,
    description:
      "Join neighbors for a morning of trash pickup and trail care at Riverside Park. Gloves, bags, and coffee provided. Wear comfortable shoes and bring a reusable water bottle.",
    address: "Riverside Park, Austin, TX 78741",
    latitude: 30.2506,
    longitude: -97.7332,
    maxVolunteers: 40,
    minVolunteers: 5,
    startDate: daysFromNow(9),
    endDate: daysFromNow(9),
    imageSeed: "park-cleanup",
    tagNames: ["Environment"],
  },
  {
    title: "Community Food Bank Sort",
    theme: "Hunger Relief",
    workType: "physical" as const,
    helpMode: "personal" as const,
    description:
      "Help sort and pack fresh produce and pantry staples for families across the city. No heavy lifting required — just a willingness to help and a smile.",
    address: "Eastside Pantry, 123 Oak St, Austin, TX 78702",
    latitude: 30.2562,
    longitude: -97.7202,
    maxVolunteers: 30,
    minVolunteers: 3,
    startDate: daysFromNow(10),
    endDate: daysFromNow(10),
    imageSeed: "food-bank",
    tagNames: ["Underprivileged", "Homeless"],
  },
  {
    title: "Animal Shelter Dog Walk",
    theme: "Animal Care",
    workType: "physical" as const,
    helpMode: "personal" as const,
    description:
      "Take shelter dogs for a walk around the neighborhood and give them the exercise and socialization they need while waiting for their forever homes.",
    address: "Austin Animal Center, 7201 Levander Loop, Austin, TX 78702",
    latitude: 30.2462,
    longitude: -97.7082,
    maxVolunteers: 20,
    minVolunteers: 2,
    startDate: daysFromNow(12),
    endDate: daysFromNow(12),
    imageSeed: "dog-walk",
    tagNames: ["Dogs", "Animal Rescue"],
  },
  {
    title: "Elderly Tech Help Session",
    theme: "Digital Inclusion",
    workType: "social" as const,
    helpMode: "personal" as const,
    description:
      "Help seniors learn to use their smartphones, tablets, and laptops. From video calling grandkids to ordering groceries online — patience and a friendly attitude are all you need.",
    address: "Central Library, 710 W César Chávez St, Austin, TX 78701",
    latitude: 30.2661,
    longitude: -97.7496,
    maxVolunteers: 15,
    minVolunteers: 2,
    startDate: daysFromNow(15),
    endDate: daysFromNow(15),
    imageSeed: "tech-help",
    tagNames: ["Elderly"],
  },
  {
    title: "After-School Reading Buddies",
    theme: "Education",
    workType: "social" as const,
    helpMode: "personal" as const,
    description:
      "Spend an afternoon reading with elementary school kids and spark a lifelong love of books. Reading materials and snacks provided.",
    address: "Maplewood Elementary, 3808 Maplewood Ave, Austin, TX 78722",
    latitude: 30.2966,
    longitude: -97.7168,
    maxVolunteers: 12,
    minVolunteers: 2,
    startDate: daysFromNow(13),
    endDate: daysFromNow(13),
    imageSeed: "reading-buddies",
    tagNames: ["Schools", "Children"],
  },
  {
    title: "Youth Coding Workshop",
    theme: "Tech Education",
    workType: "office" as const,
    helpMode: "online" as const,
    description:
      "Teach middle and high school students the basics of web development in this hands-on virtual workshop. No teaching experience required — curriculum and lesson plans provided.",
    address: "Online — Zoom link sent after signup",
    maxVolunteers: 8,
    minVolunteers: 1,
    startDate: daysFromNow(18),
    endDate: daysFromNow(18),
    imageSeed: "coding-workshop",
    tagNames: ["Youth", "Schools"],
  },
  {
    title: "Community Garden Planting",
    theme: "Urban Greening",
    workType: "physical" as const,
    helpMode: "personal" as const,
    description:
      "Help transform a vacant lot into a thriving community garden. We'll be planting vegetables, building raised beds, and mulching paths. Tools and seeds provided.",
    address: "Festival Beach Community Garden, 35 Waller St, Austin, TX 78702",
    latitude: 30.2566,
    longitude: -97.7296,
    maxVolunteers: 25,
    minVolunteers: 4,
    startDate: daysFromNow(20),
    endDate: daysFromNow(20),
    imageSeed: "garden-planting",
    tagNames: ["Environment", "Schools"],
  },
  {
    title: "Homeless Shelter Meal Prep",
    theme: "Hunger Relief",
    workType: "social" as const,
    helpMode: "personal" as const,
    description:
      "Join the kitchen crew to prepare and serve warm meals for shelter residents. Cooking experience welcome but not required — we'll teach you everything.",
    address: "ARCH Shelter, 500 E 7th St, Austin, TX 78701",
    latitude: 30.2642,
    longitude: -97.7372,
    maxVolunteers: 15,
    minVolunteers: 3,
    startDate: daysFromNow(16),
    endDate: daysFromNow(16),
    imageSeed: "meal-prep",
    tagNames: ["Homeless", "Underprivileged"],
  },
  {
    title: "Trail Restoration at Barton Creek",
    theme: "Environment",
    workType: "physical" as const,
    helpMode: "personal" as const,
    description:
      "Help restore the Greenbelt by clearing invasive plants, repairing trail erosion, and planting native species. A great workout with a lasting impact.",
    address:
      "Barton Creek Greenbelt, 3755 Capital of Texas Hwy S, Austin, TX 78704",
    latitude: 30.2491,
    longitude: -97.7982,
    maxVolunteers: 30,
    minVolunteers: 3,
    startDate: daysFromNow(25),
    endDate: daysFromNow(25),
    imageSeed: "trail-restore",
    tagNames: ["Environment"],
  },
  {
    title: "Weekly Cat Cuddle Shift",
    theme: "Animal Care",
    workType: "social" as const,
    helpMode: "personal" as const,
    description:
      "Spend time socializing with shelter cats — petting, playing, and helping them stay comfortable and adoptable. Purr therapy included at no extra charge.",
    address: "Austin Pets Alive, 1156 W César Chávez St, Austin, TX 78703",
    latitude: 30.2676,
    longitude: -97.7577,
    maxVolunteers: 10,
    minVolunteers: 1,
    startDate: daysFromNow(7),
    endDate: daysFromNow(7),
    imageSeed: "cat-cuddles",
    tagNames: ["Cats", "Animal Rescue"],
  },
];

export async function run() {
  const [organizer] = await db.select({ id: user.id }).from(user).limit(1);

  if (!organizer) {
    console.log(
      "No users found — create an account first, then run this script."
    );
    return;
  }

  const allTags = await db.select({ id: tags.id, name: tags.name }).from(tags);

  for (const ev of seedEvents) {
    const tagIds = ev.tagNames
      .map((name) => allTags.find((t) => t.name === name)?.id)
      .filter(Boolean) as number[];

    if (tagIds.length === 0) {
      console.log(
        `  Skipping "${ev.title}" — no matching tags found (run db:seed first)`
      );
      continue;
    }

    const [inserted] = await db
      .insert(events)
      .values({
        organizerId: organizer.id,
        title: ev.title,
        theme: ev.theme,
        workType: ev.workType,
        helpMode: ev.helpMode,
        description: ev.description,
        address: ev.address,
        latitude: ev.latitude ?? null,
        longitude: ev.longitude ?? null,
        maxVolunteers: ev.maxVolunteers ?? null,
        minVolunteers: ev.minVolunteers ?? null,
        startDate: ev.startDate ?? null,
        endDate: ev.endDate ?? null,
        status: "published",
        imageUrl: picsum(ev.imageSeed),
        galleryImages: galleryUrls(ev.imageSeed, 3),
      })
      .returning({ id: events.id });

    if (!inserted) {
      console.log(`  Failed to insert "${ev.title}"`);
      continue;
    }

    await db.insert(eventTags).values(
      tagIds.map((tagId) => ({
        eventId: inserted.id,
        tagId,
      }))
    );

    console.log(
      `  Seeded "${ev.title}" with ${tagIds.length} tag(s) [image: ${ev.imageSeed}]`
    );
  }

  console.log("Events seeded.");
}

run().catch((err) => {
  console.error("Failed to seed events:", err);
  process.exit(1);
});
