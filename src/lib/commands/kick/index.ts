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
  writePostGenerateFiles,
} from "@/lib/commands/kick/generators.js";

import { resolveProjectPath } from "@/lib/utils/paths.js";

import { Database, FreshOptions } from "@/lib/types/index.js";
import {
  promptForStarter,
  applyTodoStarter,
  applyMathNpmStarter,
  applyMathCliStarter,
} from "@/lib/commands/kick/starters.js";

export const registerFreshCommand = (program: Command): void => {
  program
    .command("init [project-name]")
    .aliases(["in"])
    .description("Create a new Kickpress project")
    .option("-t, --template <template>", "Template to use (api|npm|cli|web)")
    .option("-d, --database <database>", "Database to use (sqlite|postgresql|mysql|none)")
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

        // Prompt for starter (interactive only — -y always uses blank)
        const starter = useDefaults ? "blank" : await promptForStarter(template);

        // Prompt for TypeScript if not specified
        const useTypeScript =
          options.typescript !== undefined
            ? options.typescript
            : useDefaults ? true : await promptForTypeScript();

        // Determine database — npm packages never need one; CLI tools can optionally use one
        // Todo starter always uses SQLite (can't db:push PostgreSQL without a live connection)
        let database: Database;
        if (template === "npm") {
          database = Database.None;
        } else if (starter === "todo") {
          // Todo starter defaults to SQLite; MongoDB allowed via --database flag
          database = (options.database as Database) === Database.MongoDB
            ? Database.MongoDB
            : Database.SQLite;
        } else if (options.database) {
          if (!Object.values(Database).includes(options.database as Database)) {
            console.error(
              chalk.red(`❌ Invalid database option: ${options.database}. Valid options: sqlite, postgresql, mysql, mongodb, none`),
            );
            process.exit(1);
          }
          database = options.database as Database;
        } else {
          // --y default: sqlite for api/web, none for cli
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

        // Apply starter content (writes entity files, overrides schema/validation/types)
        if (starter === "todo" && (template === "api" || template === "web")) {
          console.log(chalk.gray("🚀 Applying Todo starter..."));
          await applyTodoStarter(projectPath, useTypeScript, packageManager, template, database);
        } else if (starter === "math" && template === "npm") {
          console.log(chalk.gray("🚀 Applying Math library starter..."));
          applyMathNpmStarter(projectPath, useTypeScript, projectName);
        } else if (starter === "math" && template === "cli") {
          console.log(chalk.gray("🚀 Applying Math CLI starter..."));
          applyMathCliStarter(projectPath, useTypeScript, projectName);
        }

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

          execSync(generateCmd, {
            cwd: projectPath,
            stdio: "inherit",
          });

          // Only now that the generated client actually exists, write the files
          // that import from it — writing them earlier risks a dangling import
          // if install/generate had failed or been interrupted first.
          writePostGenerateFiles(projectPath, useTypeScript, database, template);

          if (database === Database.SQLite || database === Database.MongoDB) {
            const pushCmd =
              packageManager === "npm"
                ? `${packageManager} run db:push`
                : `${packageManager} db:push`;

            execSync(pushCmd, {
              cwd: projectPath,
              stdio: "inherit",
            });

            console.log(chalk.green("\n✅ Database initialized!\n"));
          } else {
            console.log(chalk.green("\n✅ Prisma client generated!\n"));
          }
        }

        console.log(chalk.green(`\n✅ Project created successfully!\n`));

        const devCmd =
          packageManager === "npm"
            ? `${packageManager} run dev`
            : `${packageManager} dev`;

        const pushCmd =
          packageManager === "npm"
            ? `${packageManager} run db:push`
            : `${packageManager} db:push`;

        console.log(chalk.cyan("Next steps:"));
        console.log(chalk.gray(`  cd ${projectName}`));

        if (database === Database.PostgreSQL) {
          console.log(chalk.gray(`  1. Set DATABASE_URL in .env to your PostgreSQL connection string`));
          console.log(chalk.gray(`  2. Run: ${pushCmd}`));
          console.log(chalk.gray(`  3. Run: ${devCmd}`));
        } else if (database === Database.MySQL) {
          console.log(chalk.gray(`  1. Set DATABASE_URL in .env to your MySQL connection string`));
          console.log(chalk.gray(`  2. Run: ${pushCmd}`));
          console.log(chalk.gray(`  3. Run: ${devCmd}`));
        } else if (database === Database.MongoDB) {
          console.log(chalk.gray(`  1. Set DATABASE_URL in .env to your MongoDB connection string`));
          console.log(chalk.gray(`  2. Run: ${pushCmd}`));
          console.log(chalk.gray(`  3. Run: ${devCmd}`));
        } else {
          console.log(chalk.gray(`  ${devCmd}`));
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
