import { PrismaClient } from "@prisma/client";
import acronyms from "./defaults/acronym.json";

const prisma = new PrismaClient();

const main = async () => {
  for (const item of acronyms) {
    const acronym = Object.keys(item)[0];
    const meaning = Object.values<string>(item)[0];

    await prisma.acronym.upsert({
      create: {
        acronym,
        meaning,
      },
      update: {},
      where: {
        acronym,
      },
    });
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
