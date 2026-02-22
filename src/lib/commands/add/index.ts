import { Command } from "commander";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

import { getWorkingDirectory } from "@/lib/utils/paths.js";
import { detectProjectConfig } from "@/lib/commands/make/detect.js";
import {
  generatePrismaSchema,
  generatePrismaConfig,
  generatePrismaClient,
  generateErrorMiddleware,
} from "@/lib/commands/kick/generators.js";
import { Database } from "@/lib/types/index.js";

export const registerAddCommand = (program: Command): void => {
  const addCommand = new Command("add").description(
    "Add features to an existing project"
  );

  addCommand
    .command("db [database]")
    .description("Add Prisma database support to an existing project (sqlite|postgresql)")
    .action(async (database?: string) => {
      try {
        const workingDir = getWorkingDirectory();
        const projectConfig = detectProjectConfig(workingDir);

        if (!projectConfig) {
          console.error(
            chalk.red("❌ Not in a Kickpress project. Run 'kickpress init' first.")
          );
          process.exit(1);
        }

        if (projectConfig.hasDatabase) {
          console.error(
            chalk.red("❌ This project already has a database configured.")
          );
          process.exit(1);
        }

        // Validate or prompt for database type
        let db: Database;
        if (database) {
          if (database !== "sqlite" && database !== "postgresql") {
            console.error(
              chalk.red("❌ Invalid database. Valid options: sqlite, postgresql")
            );
            process.exit(1);
          }
          db = database === "sqlite" ? Database.SQLite : Database.PostgreSQL;
        } else {
          db = await select({
            message: "Which database would you like to add?",
            choices: [
              { name: "SQLite  (file-based, zero config)", value: Database.SQLite },
              { name: "PostgreSQL  (requires a running server)", value: Database.PostgreSQL },
            ],
          });
        }

        const { typescript, packageManager, fileExtension } = projectConfig;
        const ext = fileExtension;
        const pm = packageManager;

        const installProd = (pkgs: string) =>
          pm === "npm" ? `npm install --save ${pkgs}` :
          pm === "yarn" ? `yarn add ${pkgs}` :
          `pnpm add ${pkgs}`;

        const installDev = (pkgs: string) =>
          pm === "npm" ? `npm install --save-dev ${pkgs}` :
          pm === "yarn" ? `yarn add --dev ${pkgs}` :
          `pnpm add --save-dev ${pkgs}`;

        const run = (cmd: string) =>
          pm === "npm" ? `npm run ${cmd}` : `${pm} ${cmd}`;

        console.log(chalk.blue(`\n☕ Adding ${db} database support...\n`));

        // 1. Install packages
        console.log(chalk.gray("📦 Installing dependencies..."));

        const corePkgs = ["@prisma/client"];
        if (db === Database.SQLite) {
          corePkgs.push("better-sqlite3", "@prisma/adapter-better-sqlite3");
        } else {
          corePkgs.push("@prisma/adapter-pg");
        }

        execSync(installProd(corePkgs.join(" ")), { cwd: workingDir, stdio: "inherit" });
        execSync(installDev("prisma"), { cwd: workingDir, stdio: "inherit" });

        if (db === Database.SQLite) {
          execSync(installDev("@types/better-sqlite3"), { cwd: workingDir, stdio: "inherit" });
        }

        // 2. Create prisma directory and schema
        console.log(chalk.gray("📝 Creating Prisma schema..."));
        const prismaDir = join(workingDir, "prisma");
        mkdirSync(prismaDir, { recursive: true });

        writeFileSync(join(prismaDir, "schema.prisma"), generatePrismaSchema(db));

        // 3. Create prisma.config.ts
        writeFileSync(join(workingDir, "prisma.config.ts"), generatePrismaConfig());

        // 4. Create src/lib/prisma client file
        console.log(chalk.gray("📝 Creating Prisma client..."));
        const libDir = join(workingDir, "src", "lib");
        mkdirSync(libDir, { recursive: true });

        writeFileSync(join(libDir, `prisma.${ext}`), generatePrismaClient(typescript, db));

        // 5. Patch error middleware to handle Prisma errors
        console.log(chalk.gray("📝 Updating error middleware..."));
        const middlewarePath = join(
          workingDir,
          "src",
          "middlewares",
          `error.middleware.${ext}`
        );

        if (existsSync(middlewarePath)) {
          writeFileSync(middlewarePath, generateErrorMiddleware(typescript, true));
        }

        // 6. Append DATABASE_URL to .env
        console.log(chalk.gray("📝 Updating .env..."));
        const envPath = join(workingDir, ".env");
        const envContent = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";

        if (!envContent.includes("DATABASE_URL")) {
          const dbUrl =
            db === Database.SQLite
              ? "file:./dev.db"
              : "postgresql://user:password@host:port/database?schema=public";
          writeFileSync(envPath, envContent.trimEnd() + `\nDATABASE_URL="${dbUrl}"\n`);
        }

        // 7. Append Prisma entries to .gitignore
        console.log(chalk.gray("📝 Updating .gitignore..."));
        const gitignorePath = join(workingDir, ".gitignore");
        const gitignoreContent = existsSync(gitignorePath)
          ? readFileSync(gitignorePath, "utf-8")
          : "";

        if (!gitignoreContent.includes("src/lib/generated/")) {
          writeFileSync(
            gitignorePath,
            gitignoreContent.trimEnd() +
              "\n\n# Prisma\n*.db\n*.db-journal\nsrc/lib/generated/\n"
          );
        }

        // 8. Add db scripts to package.json
        console.log(chalk.gray("📝 Updating package.json scripts..."));
        const pkgPath = join(workingDir, "package.json");
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        pkg.scripts = pkg.scripts ?? {};
        pkg.scripts["db:generate"] = "prisma generate";
        pkg.scripts["db:push"] = "prisma db push";
        pkg.scripts["db:migrate"] = "prisma migrate dev";
        pkg.scripts["db:studio"] = "prisma studio";
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

        // 9. Generate client and push schema
        console.log(chalk.blue("\n📦 Running Prisma generate...\n"));
        execSync(run("db:generate"), { cwd: workingDir, stdio: "inherit" });

        console.log(chalk.blue("\n📦 Running Prisma push...\n"));
        execSync(run("db:push"), { cwd: workingDir, stdio: "inherit" });

        console.log(chalk.green("\n✅ Database added successfully!\n"));

        if (db === Database.PostgreSQL) {
          console.log(
            chalk.yellow(
              "🚨 Update DATABASE_URL in .env with your PostgreSQL connection string\n"
            )
          );
        }

        if (pm === "pnpm" && db === Database.SQLite) {
          console.log(
            chalk.yellow(
              "⚠️  If you see native build errors, run: pnpm approve-builds (select better-sqlite3)\n"
            )
          );
        }

        console.log(chalk.cyan("Next steps:"));
        console.log(chalk.gray("  1. Add models to prisma/schema.prisma"));
        console.log(chalk.gray(`  2. Run: ${run("db:generate")}`));
        console.log(chalk.gray(`  3. Run: ${run("db:push")}`));
        console.log(chalk.gray("  4. Run: kickpress make <entity>"));
      } catch (error) {
        console.error(
          chalk.red(`\n❌ Error adding database: ${(error as Error).message}\n`)
        );
        process.exit(1);
      }
    });

  program.addCommand(addCommand);
};
