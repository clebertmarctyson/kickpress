import { Command } from "commander";
import { execSync } from "child_process";
import chalk from "chalk";
import { input } from "@inquirer/prompts";
import { getWorkingDirectory } from "@/lib/utils/paths.js";
import { detectProjectConfig } from "@/lib/commands/make/detect.js";
import { generateModule } from "@/lib/commands/make/generators/module.js";
import { generateController } from "@/lib/commands/make/generators/controller.js";
import { generateValidations } from "./generators/validation.js";
import { generateModel } from "@/lib/commands/make/generators/model.js";
import { generateTypes } from "@/lib/commands/make/generators/types.js";
import { generateHttpRequests } from "@/lib/commands/make/generators/http.js";
import { updatePrismaSchema } from "@/lib/commands/make/generators/schema.js";
import { generateService } from "@/lib/commands/make/generators/service.js";
import { injectRouteIntoIndex } from "@/lib/commands/make/injectors/index-injector.js";
import { capitalizeFirst } from "@/lib/utils/index.js";

export const registerInventCommand = (program: Command): void => {
  program
    .command("make <entity>")
    .aliases(["mk"])
    .description("Generate all CRUD resources for an entity")
    .option("--table <table>", "Table name (plural form), skips prompt")
    .option("--route <route>", "Route path (e.g. /todos), skips prompt")
    .action(async (entity: string, opts: { table?: string; route?: string }) => {
      try {
        const workingDir = getWorkingDirectory();

        // Check if we're in an Kickpress project
        const projectConfig = detectProjectConfig(workingDir);

        if (!projectConfig) {
          console.error(
            chalk.red(
              "❌ Not in a Kickpress project. Run 'kickpress init' first."
            )
          );
          process.exit(1);
        }

        // Resolve table name — prompt only if not provided via flag
        const tableName = opts.table ?? await input({
          message: "What should the table name be? (plural form)",
          default: `${entity}s`,
          validate: (value) => {
            if (!value.trim()) return "Table name cannot be empty";
            return true;
          },
        });

        // Resolve route path — prompt only if not provided via flag
        const routePath = opts.route ?? await input({
          message: "What should the route path be?",
          default: `/${tableName}`,
          validate: (value) => {
            if (!value.startsWith("/")) return "Route path must start with /";
            return true;
          },
        });

        const entityCapitalized = capitalizeFirst(entity);

        console.log(chalk.blue(`\n☕ Generating resources for '${entity}'...\n`));

        console.log(chalk.gray("📝 Creating model..."));
        await generateModel(
          workingDir,
          entity,
          entityCapitalized,
          projectConfig
        );

        if (projectConfig.hasDatabase) {
          console.log(chalk.gray("📝 Updating Prisma schema..."));
          await updatePrismaSchema(workingDir, entityCapitalized);
        }

        console.log(chalk.gray("📝 Creating types..."));
        await generateTypes(
          workingDir,
          entity,
          entityCapitalized,
          projectConfig
        );

        console.log(chalk.gray("📝 Creating service..."));
        await generateService(
          workingDir,
          entity,
          entityCapitalized,
          projectConfig
        );

        console.log(chalk.gray("📝 Creating controller..."));
        await generateController(
          workingDir,
          entity,
          entityCapitalized,
          tableName,
          projectConfig
        );

        console.log(chalk.gray("📝 Creating validations..."));
        await generateValidations(workingDir, entity, projectConfig);

        console.log(chalk.gray("📝 Creating module..."));
        await generateModule(workingDir, entity, entityCapitalized, projectConfig);

        console.log(chalk.gray("📝 Updating routes barrel..."));
        await injectRouteIntoIndex(
          workingDir,
          entity,
          routePath,
          projectConfig
        );

        console.log(chalk.gray("📝 Creating HTTP requests..."));
        await generateHttpRequests(workingDir, entity, tableName, routePath);

        console.log(chalk.green("\n✅ Resources generated successfully!\n"));

        if (projectConfig.hasDatabase) {
          const pm = projectConfig.packageManager;
          const run = (cmd: string) =>
            pm === "npm" ? `${pm} run ${cmd}` : `${pm} ${cmd}`;

          console.log(chalk.blue("\n📦 Running Prisma generate...\n"));
          execSync(run("db:generate"), { cwd: workingDir, stdio: "inherit" });

          console.log(chalk.blue("\n📦 Running Prisma push...\n"));
          execSync(run("db:push"), { cwd: workingDir, stdio: "inherit" });

          console.log(chalk.green("\n✅ Database updated successfully!\n"));

          console.log(chalk.cyan("⚠️  Next steps:"));
          console.log(
            chalk.gray(
              `  1. Add fields to ${entityCapitalized} model in prisma/schema.prisma`
            )
          );
          console.log(chalk.gray(`  2. Run: ${run("db:generate")}`));
          console.log(chalk.gray(`  3. Run: ${run("db:push")}`));
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
