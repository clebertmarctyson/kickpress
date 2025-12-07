import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const generateTypes = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  // Only generate types for TypeScript projects
  if (!config.typescript) {
    return;
  }

  const typesDir = join(workingDir, config.srcDir, "types");

  if (!existsSync(typesDir)) {
    mkdirSync(typesDir, { recursive: true });
  }

  const typeFile = join(typesDir, `${entity}.d.ts`);

  const content = `export interface ${entityCapitalized} {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ${entityCapitalized}CreateInput = Omit<${entityCapitalized}, "id" | "createdAt" | "updatedAt">;

export type ${entityCapitalized}UpdateInput = Partial<${entityCapitalized}CreateInput>;
`;

  writeFileSync(typeFile, content);
};
