import { input, select, confirm } from "@inquirer/prompts";

import { detectProjectConfig } from "@/lib/commands/make/detect.js";
import { Database } from "@/lib/types/index.js";

export interface FreshAnswers {
  projectName: string;
  typescript: boolean;
  database: string;
  template: string;
  installDeps: boolean;
}

export const promptForProjectName = async (): Promise<string> => {
  return await input({
    message: "What is your project name?",
    default: "my-kickpress-app",
    validate: (value) => {
      if (!value.trim()) {
        return "Project name cannot be empty";
      }
      if (!/^[a-z0-9-_]+$/i.test(value)) {
        return "Project name can only contain letters, numbers, hyphens, and underscores";
      }
      return true;
    },
  });
};

export const promptForTypeScript = async (): Promise<boolean> => {
  return await confirm({
    message: "Would you like to use TypeScript?",
    default: true,
  });
};

export const promptForTemplate = async (): Promise<string> => {
  return await select({
    message: "Which template would you like to use?",
    default: "default",
    choices: [
      { name: "Default (REST API)", value: "default" },
      { name: "API Only", value: "api" },
      { name: "Full Stack", value: "fullstack" },
    ],
  });
};

export const promptForDatabase = async (): Promise<Database> => {
  return await select({
    message: "Which database would you like to use?",
    default: "sqlite",
    choices: [
      { name: "SQLite (default)", value: Database.SQLite },
      { name: "PostgreSQL", value: Database.PostgreSQL },
    ],
  });
};

export const promptForPackageManager = async (): Promise<
  "pnpm" | "npm" | "yarn"
> => {
  const defaultPackageManager = detectProjectConfig(
    process.cwd()
  )?.packageManager;

  return await select({
    message: "Which package manager would you like to use?",
    default: defaultPackageManager,
    choices: [
      { name: "pnpm (recommended)", value: "pnpm" },
      { name: "npm", value: "npm" },
      { name: "yarn", value: "yarn" },
    ],
  });
};
