import { prisma } from "./index.ts";
import { randomUUID } from "crypto";

console.log("Scraper started...");

// TODO: transitions, _id in DB

async function createLearningPaths() {
  const response = await fetch(
    "https://dwengo.org/backend/api/learningPath/search?all"
  );
  const learningPaths = await response.json();

  for (const lp of learningPaths) {
    // instantly add learning path metadata to DB
    const newLP = await prisma.learningPath.create({
      data: {
        hruid: lp.hruid,
        uuid: randomUUID(),
        language: lp.language,
        title: lp.title,
        description: lp.description,
        image: lp.image,
      },
    });
    console.log(
      `Created learning path: ${newLP.hruid} with uuid: ${newLP.uuid}`
    );

    // process each node
    if (lp.nodes && Array.isArray(lp.nodes)) {
      for (const node of lp.nodes) {
        // metadata
        const metadataUrl = `https://dwengo.org/backend/api/learningObject/getMetadata?hruid=${node.learningobject_hruid}&language=${node.language}`;
        const metaResponse = await fetch(metadataUrl);
        const metaData = await metaResponse.json();

        // raw HTML content
        const rawUrl = `https://dwengo.org/backend/api/learningObject/getRaw?hruid=${node.learningobject_hruid}&language=${node.language}`;
        const rawResponse = await fetch(rawUrl);
        const htmlContent = await rawResponse.text(); // remove \n's?

        // add to DB
        const newLO = await prisma.learningObject.create({
          data: {
            id: node._id,
            hruid: node.learningobject_hruid,
            uuid: randomUUID(),
            language: node.language,
            version: String(node.version),
            html_content: htmlContent,
          },
        });
        console.log(
          `Created learning object: ${newLO.hruid} with id: ${newLO.id}`
        );
      }
    }
    break; // TODO
  }
}

createLearningPaths()
  .then(() => {
    console.log("All learning paths created.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating learning paths:", error);
    process.exit(1);
  });
