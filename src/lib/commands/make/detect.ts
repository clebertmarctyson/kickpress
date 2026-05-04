import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Database } from "@/lib/types/index.js";

export interface ProjectConfig {
  typescript: boolean;
  packageManager: "pnpm" | "npm" | "yarn";
  srcDir: string;
  fileExtension: string;
  hasDatabase: boolean;
  database?: Database;
}

export const detectProjectConfig = (
  workingDir: string
): ProjectConfig | null => {
  const packageJsonPath = join(workingDir, "package.json");
  const tsconfigPath = join(workingDir, "tsconfig.json");
  const srcPath = join(workingDir, "src");

  // Check if it's an Kickpress project
  if (!existsSync(packageJsonPath) || !existsSync(srcPath)) {
    return null;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  // Check if it's a Kickpress project (Express API/web or Commander CLI)
  if (!packageJson.dependencies?.express && !packageJson.dependencies?.commander) {
    return null;
  }

  // Detect TypeScript
  const typescript = existsSync(tsconfigPath);

  // Detect package manager
  let packageManager: "pnpm" | "npm" | "yarn" = "pnpm";

  if (existsSync(join(workingDir, "pnpm-lock.yaml"))) {
    packageManager = "pnpm";
  } else if (existsSync(join(workingDir, "yarn.lock"))) {
    packageManager = "yarn";
  } else if (existsSync(join(workingDir, "package-lock.json"))) {
    packageManager = "npm";
  }

  const hasDatabase =
    !!packageJson.dependencies?.["@prisma/client"] ||
    !!packageJson.devDependencies?.prisma;

  let database: Database | undefined;
  if (hasDatabase) {
    const schemaPath = join(workingDir, "prisma", "schema.prisma");
    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, "utf-8");
      const match = schema.match(/provider\s*=\s*"(sqlite|postgresql|mysql|mongodb)"/);
      if (match) {
        const provider = match[1];
        if (provider === "sqlite") database = Database.SQLite;
        else if (provider === "postgresql") database = Database.PostgreSQL;
        else if (provider === "mysql") database = Database.MySQL;
        else if (provider === "mongodb") database = Database.MongoDB;
      }
    }
  }

  return {
    typescript,
    packageManager,
    srcDir: "src",
    fileExtension: typescript ? "ts" : "js",
    hasDatabase,
    database,
  };
};
