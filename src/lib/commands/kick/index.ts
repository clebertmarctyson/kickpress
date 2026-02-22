import { Command } from "commander";
import { existsSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import {
  promptForProjectName,
  promptForTypeScript,
  promptForTemplate,
  promptForDatabase,
  promptForPackageManager,
} from "@/lib/commands/kick/prompts.js";

import {
  createProjectStructure,
  writeProjectFiles,
} from "@/lib/commands/kick/generators.js";

import { resolveProjectPath } from "@/lib/utils/paths.js";

import { Database, FreshOptions } from "@/lib/types/index.js";

export const registerFreshCommand = (program: Command): void => {
  program
    .command("init [project-name]")
    .aliases(["in"])
    .description("Create a new Kickpress project")
    .option("-t, --template <template>", "Template to use (api|npm|cli|web)")
    .option("-d, --database <database>", "Database to use (sqlite|postgresql|none)")
    .option("--typescript", "Use TypeScript")
    .option("--no-typescript", "Use JavaScript")
    .option("-p, --package-manager <package-manager>", "Package manager to use")
    .option("-y, --yes", "Accept all defaults without prompting")
    .action(async (projectName: string | undefined, options: FreshOptions) => {
      try {
        const useDefaults = !!options.yes;

        // Prompt for project name if not provided
        if (!projectName) {
          projectName = useDefaults
            ? "my-kickpress-app"
            : await promptForProjectName();
        }

        const projectPath = resolveProjectPath(projectName);

        // Check if directory exists
        if (existsSync(projectPath)) {
          console.error(
            chalk.red(`❌ Directory '${projectName}' already exists`),
          );
          process.exit(1);
        }

        // Resolve template (prompt if not provided via flag)
        const template = options.template || (useDefaults ? "api" : await promptForTemplate());

        // Prompt for TypeScript if not specified
        const useTypeScript =
          options.typescript !== undefined
            ? options.typescript
            : useDefaults ? true : await promptForTypeScript();

        // Determine database — npm and cli templates never need one
        let database: Database;
        if (template === "npm" || template === "cli") {
          database = Database.None;
        } else if (options.database) {
          if (!Object.values(Database).includes(options.database as Database)) {
            console.error(
              chalk.red(`❌ Invalid database option: ${options.database}. Valid options: sqlite, postgresql, none`),
            );
            process.exit(1);
          }
          database = options.database as Database;
        } else {
          // --y default: sqlite for api/web (needs DB), none otherwise
          database = useDefaults
            ? (template === "api" || template === "web" ? Database.SQLite : Database.None)
            : await promptForDatabase();
        }

        // Prompt for package manager
        const packageManager =
          options.packageManager || (useDefaults ? "pnpm" : await promptForPackageManager());

        console.log(
          chalk.blue(
            `\n☕ Creating Kickpress project: ${chalk.bold(projectName)}\n`,
          ),
        );

        // Create project directory
        mkdirSync(projectPath);

        // Create folder structure
        console.log(chalk.gray("📁 Creating project structure..."));
        createProjectStructure(projectPath, database, template);

        // Create all project files
        console.log(chalk.gray("📝 Creating project files..."));

        writeProjectFiles(
          {
            projectName,
            projectPath,
            typescript: useTypeScript,
            database,
            template,
          },
          packageManager,
        );

        console.log(chalk.blue("\n📦 Installing dependencies...\n"));

        const installCmd = `${packageManager} install`;

        execSync(installCmd, {
          cwd: projectPath,
          stdio: "inherit",
        });

        console.log(chalk.green("\n✅ Dependencies installed!\n"));

        if (database !== Database.None) {
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
        }

        console.log(chalk.green(`\n✅ Project created successfully!\n`));

        console.log(chalk.cyan("Next steps:"));

        console.log(chalk.gray(`cd ${projectName}`));

        console.log(
          chalk.gray(
            packageManager === "npm"
              ? `${packageManager} run dev`
              : `${packageManager} dev`,
          ),
        );

        if (database === Database.PostgreSQL) {
          console.log(
            chalk.yellow(
              `🚨 Update DATABASE_URL in .env file with your PostgreSQL connection string\n`,
            ),
          );
        }
      } catch (error) {
        console.error(
          chalk.red(
            `\n❌ Error creating project: ${(error as Error).message}\n`,
          ),
        );
        process.exit(1);
      }
    });
};
