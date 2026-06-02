import { db } from "@/database";
import { tags, tagTranslations } from "@/database/schema/event";

const seedTags = [
  { name: "Elderly", translations: { en: "Elderly", hu: "Idősek" } },
  { name: "Children", translations: { en: "Children", hu: "Gyerekek" } },
  { name: "Youth", translations: { en: "Youth", hu: "Fiatalok" } },
  {
    name: "Homeless",
    translations: { en: "Homeless", hu: "Hajléktalanok" },
  },
  {
    name: "Disabled",
    translations: {
      en: "People with Disabilities",
      hu: "Fogyatékossággal élők",
    },
  },
  {
    name: "Underprivileged",
    translations: {
      en: "Underprivileged Communities",
      hu: "Szegregátumok",
    },
  },
  { name: "Schools", translations: { en: "Schools", hu: "Iskolák" } },
  { name: "Dogs", translations: { en: "Dogs", hu: "Kutyák" } },
  { name: "Cats", translations: { en: "Cats", hu: "Macskák" } },
  { name: "Birds", translations: { en: "Birds", hu: "Madarak" } },
  { name: "Ducks", translations: { en: "Ducks", hu: "Kacsák" } },
  {
    name: "Animal Rescue",
    translations: { en: "Animal Rescue", hu: "Fajtamentés" },
  },
];

export async function run() {
  console.log("Seeding tags...");

  for (const tag of seedTags) {
    const [inserted] = await db
      .insert(tags)
      .values({ name: tag.name })
      .onConflictDoNothing()
      .returning();

    if (!inserted) {
      console.log(`  Tag "${tag.name}" already exists, skipping translations`);
      continue;
    }

    await db.insert(tagTranslations).values([
      { tagId: inserted.id, locale: "en", name: tag.translations.en },
      { tagId: inserted.id, locale: "hu", name: tag.translations.hu },
    ]);

    console.log(`  Seeded tag "${tag.name}" with en/hu translations`);
  }

  console.log("Tags seeded.");
}
