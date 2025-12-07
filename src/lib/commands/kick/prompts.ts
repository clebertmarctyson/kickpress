import { input, select, confirm } from "@inquirer/prompts";

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
