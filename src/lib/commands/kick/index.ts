import { Command } from "commander";
import { existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { select } from "@inquirer/prompts";

import {
  promptForProjectName,
  promptForTypeScript,
} from "@/lib/commands/kick/prompts.js";

import {
  createProjectStructure,
  writeProjectFiles,
} from "@/lib/commands/kick/generators.js";

import { resolveProjectPath } from "@/lib/utils/paths.js";

interface FreshOptions {
  template?: string;
  database?: string;
  typescript?: boolean;
}

const detectPackageManager = (): "pnpm" | "npm" | "yarn" => {
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return "pnpm";
  } catch {
    try {
      execSync("yarn --version", { stdio: "ignore" });
      return "yarn";
    } catch {
      return "npm";
    }
  }
};

const promptForPackageManager = async (): Promise<"pnpm" | "npm" | "yarn"> => {
  const detected = detectPackageManager();

  return await select({
    message: "Which package manager would you like to use?",
    default: detected,
    choices: [
      { name: "pnpm (recommended)", value: "pnpm" },
      { name: "npm", value: "npm" },
      { name: "yarn", value: "yarn" },
    ],
  });
};

export const registerFreshCommand = (program: Command): void => {
  program
    .command("kick [project-name]")
    .aliases(["k", "new", "n", "create", "c", "init", "i"])
    .description("Create a new Kickpress project")
    .option("-t, --template <template>", "Template to use", "default")
    .option(
      "-d, --database <database>",
      "Database to use (sqlite, postgres, mysql, mongodb)"
    )
    .option("--typescript", "Use TypeScript")
    .option("--no-typescript", "Use JavaScript")
    .action(async (projectName: string | undefined, options: FreshOptions) => {
      try {
        // Prompt for project name if not provided
        if (!projectName) {
          projectName = await promptForProjectName();
        }

        const projectPath = resolveProjectPath(projectName);

        // Check if directory exists
        if (existsSync(projectPath)) {
          console.error(
            chalk.red(`❌ Directory '${projectName}' already exists`)
          );
          process.exit(1);
        }

        // Prompt for TypeScript if not specified
        const useTypeScript =
          options.typescript !== undefined
            ? options.typescript
            : await promptForTypeScript();

        // Prompt for database if not specified
        const database = options.database || "sqlite";

        // Prompt for package manager
        const packageManager = await promptForPackageManager();

        console.log(
          chalk.blue(
            `\n☕ Creating Kickpress project: ${chalk.bold(projectName)}\n`
          )
        );

        // Create project directory
        mkdirSync(projectPath);

        // Create folder structure
        console.log(chalk.gray("📁 Creating project structure..."));
        createProjectStructure(projectPath);

        // Create all project files
        console.log(chalk.gray("📝 Creating project files..."));

        writeProjectFiles(
          {
            projectName,
            projectPath,
            typescript: useTypeScript,
            database,
            template: options.template || "default",
          },
          packageManager
        );

        console.log(chalk.blue("\n📦 Installing dependencies...\n"));

        const installCmd = `${packageManager} install`;

        execSync(installCmd, {
          cwd: projectPath,
          stdio: "inherit",
        });

        console.log(chalk.green("\n✅ Dependencies installed!\n"));

        const generateCmd =
          packageManager === "npm"
            ? `${packageManager} run db:generate`
            : `${packageManager} db:generate`;

        const pushCmd =
          packageManager === "npm"
            ? `${packageManager} run db:push`
            : `${packageManager} db:push`;

        execSync(generateCmd, {
          cwd: projectPath,
          stdio: "inherit",
        });

        execSync(pushCmd, {
          cwd: projectPath,
          stdio: "inherit",
        });

        console.log(chalk.green("\n✅ Database initialized!\n"));

        console.log(chalk.green(`\n✅ Project created successfully!\n`));

        console.log(chalk.cyan("Next steps:"));
        console.log(chalk.gray(`cd ${projectName}`));
        console.log(
          chalk.gray(
            packageManager === "npm"
              ? `${packageManager} run dev`
              : `${packageManager} dev`
          )
        );
      } catch (error) {
        console.error(
          chalk.red(
            `\n❌ Error creating project: ${(error as Error).message}\n`
          )
        );
        process.exit(1);
      }
    });
};
