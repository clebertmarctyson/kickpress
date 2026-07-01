import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export const updatePrismaSchema = async (
  workingDir: string,
  entityCapitalized: string
): Promise<void> => {
  const schemaPath = join(workingDir, "prisma", "schema.prisma");

  if (!existsSync(schemaPath)) {
    throw new Error("prisma/schema.prisma not found");
  }

  let schemaContent = readFileSync(schemaPath, "utf-8");

  // Check if model already exists
  const modelRegex = new RegExp(`model\\s+${entityCapitalized}\\s*{`, "m");
  if (modelRegex.test(schemaContent)) {
    console.log(
      `⚠️  Model ${entityCapitalized} already exists in schema, skipping...`
    );
    return;
  }

  const isMongo = schemaContent.includes('provider = "mongodb"');

  const newModel = isMongo
    ? `
model ${entityCapitalized} {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`
    : `
model ${entityCapitalized} {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

  // Append the new model
  schemaContent += newModel;

  writeFileSync(schemaPath, schemaContent);
};
