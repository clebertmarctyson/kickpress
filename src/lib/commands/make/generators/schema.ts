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

  // Generate new model
  const newModel = `
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
