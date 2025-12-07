import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getWorkingDirectory = (): string => {
  return process.cwd();
};

export const getCliRootDirectory = (fileName: string): string => {
  let currentDir = __dirname;

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(join(currentDir, fileName))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  throw new Error("Could not find CLI package root");
};

export const resolveProjectPath = (projectName: string): string => {
  return resolve(getWorkingDirectory(), projectName);
};
