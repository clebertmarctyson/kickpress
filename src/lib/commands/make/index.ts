import { Command } from "commander";
import { execSync } from "child_process";
import chalk from "chalk";
import { input } from "@inquirer/prompts";
import { getWorkingDirectory } from "@/lib/utils/paths.js";
import { detectProjectConfig } from "@/lib/commands/make/detect.js";
import { generateRoutes } from "@/lib/commands/make/generators/routes.js";
import { generateController } from "@/lib/commands/make/generators/controller.js";
import { generateModel } from "@/lib/commands/make/generators/model.js";
import { generateTypes } from "@/lib/commands/make/generators/types.js";
import { generateHttpRequests } from "@/lib/commands/make/generators/http.js";
import { updatePrismaSchema } from "@/lib/commands/make/generators/schema.js";
import { injectRouteIntoIndex } from "@/lib/commands/make/injectors/index-injector.js";

type ResourceType = "routes" | "controller" | "model" | "resources";

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const registerInventCommand = (program: Command): void => {
  program
    .command("make <entity> <type>")
    .aliases(["m", "generate", "gen", "g"])
    .description(
      "Generate resources (routes|controller|model|resources) for an entity"
    )
    .option("-f, --force", "Overwrite existing files")
    .action(async (entity: string, type: ResourceType) => {
      try {
        const workingDir = getWorkingDirectory();

        // Check if we're in an Kickpress project
        const projectConfig = detectProjectConfig(workingDir);

        if (!projectConfig) {
          console.error(
            chalk.red(
              "❌ Not in an Kickpress project. Run 'kickpress kick' first."
            )
          );
          process.exit(1);
        }

        // Validate type
        const validTypes = ["routes", "controller", "model", "resources"];

        if (!validTypes.includes(type)) {
          console.error(
            chalk.red(
              `❌ Invalid type '${type}'. Valid types: ${validTypes.join(", ")}`
            )
          );
          process.exit(1);
        }

        // Prompt for table name (for proper pluralization)
        const tableName = await input({
          message: "What should the table name be? (plural form)",
          default: `${entity}`,
          validate: (value) => {
            if (!value.trim()) {
              return "Table name cannot be empty";
            }
            return true;
          },
        });

        // Prompt for route path
        const routePath = await input({
          message: "What should the route path be?",
          default: `/${tableName}`,
          validate: (value) => {
            if (!value.startsWith("/")) {
              return "Route path must start with /";
            }
            return true;
          },
        });

        const entityCapitalized = capitalizeFirst(entity);

        console.log(chalk.blue(`\n☕ Generating ${type} for '${entity}'...\n`));

        const generateAll = type === "resources";

        // Generate files based on type
        if (generateAll || type === "model") {
          console.log(chalk.gray("📝 Creating model..."));
          await generateModel(
            workingDir,
            entity,
            entityCapitalized,
            projectConfig
          );

          console.log(chalk.gray("📝 Updating Prisma schema..."));
          await updatePrismaSchema(workingDir, entityCapitalized);

          console.log(chalk.gray("📝 Creating types..."));
          await generateTypes(
            workingDir,
            entity,
            entityCapitalized,
            projectConfig
          );
        }

        if (generateAll || type === "controller") {
          console.log(chalk.gray("📝 Creating controller..."));
          await generateController(
            workingDir,
            entity,
            entityCapitalized,
            tableName,
            projectConfig
          );
        }

        if (generateAll || type === "routes") {
          console.log(chalk.gray("📝 Creating routes..."));
          await generateRoutes(workingDir, entity, projectConfig);

          console.log(chalk.gray("📝 Updating index file..."));
          await injectRouteIntoIndex(
            workingDir,
            entity,
            routePath,
            projectConfig
          );
        }

        if (generateAll) {
          console.log(chalk.gray("📝 Creating HTTP requests..."));
          await generateHttpRequests(workingDir, entity, tableName, routePath);
        }

        console.log(chalk.green("\n✅ Resources generated successfully!\n"));

        if (generateAll || type === "model") {
          console.log(chalk.cyan("⚠️  Next steps:"));
          console.log(
            chalk.gray(
              `  1. Add fields to ${entityCapitalized} model in prisma/schema.prisma`
            )
          );
          console.log(
            chalk.gray(
              `  2. Run: ${
                projectConfig.packageManager === "npm"
                  ? `${projectConfig.packageManager} run db:generate`
                  : `${projectConfig.packageManager} db:generate`
              }`
            )
          );
          console.log(
            chalk.gray(
              `  3. Run: ${
                projectConfig.packageManager === "npm"
                  ? `${projectConfig.packageManager} run db:push`
                  : `${projectConfig.packageManager} db:push`
              }`
            )
          );

          // Ask if they want to run Prisma commands automatically
          const shouldRunPrisma = true;

          if (shouldRunPrisma) {
            console.log(chalk.blue("\n📦 Running Prisma generate...\n"));
            execSync(
              `${
                projectConfig.packageManager === "npm"
                  ? `${projectConfig.packageManager} run db:generate`
                  : `${projectConfig.packageManager} db:generate`
              }`,
              {
                cwd: workingDir,
                stdio: "inherit",
              }
            );

            console.log(chalk.blue("\n📦 Running Prisma push...\n"));
            execSync(
              `${
                projectConfig.packageManager === "npm"
                  ? `${projectConfig.packageManager} run db:push`
                  : `${projectConfig.packageManager} db:push`
              }`,
              {
                cwd: workingDir,
                stdio: "inherit",
              }
            );

            console.log(chalk.green("\n✅ Database updated successfully!\n"));
          }
        }
      } catch (error) {
        console.error(
          chalk.red(
            `\n❌ Error generating resources: ${(error as Error).message}\n`
          )
        );
        process.exit(1);
      }
    });
};

export { detectProjectConfig };
