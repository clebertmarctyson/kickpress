import { existsSync, readFileSync } from "fs";
import { join } from "path";

export interface ProjectConfig {
  typescript: boolean;
  packageManager: "pnpm" | "npm" | "yarn";
  srcDir: string;
  fileExtension: string;
  hasDatabase: boolean;
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

  // Check if express is a dependency
  if (!packageJson.dependencies?.express) {
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

  return {
    typescript,
    packageManager,
    srcDir: "src",
    fileExtension: typescript ? "ts" : "js",
    hasDatabase,
  };
};
