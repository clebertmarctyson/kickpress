import { Command } from "commander";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

import { getWorkingDirectory } from "@/lib/utils/paths.js";
import { generatePrismaClient, ensurePnpmAllowBuilds } from "@/lib/commands/kick/generators.js";
import { Database } from "@/lib/types/index.js";

const detectCurrentDatabase = (workingDir: string): Database | null => {
  const schemaPath = join(workingDir, "prisma", "schema.prisma");
  if (!existsSync(schemaPath)) return null;

  const schema = readFileSync(schemaPath, "utf-8");
  const match = schema.match(/provider\s*=\s*"(sqlite|postgresql|mysql|mongodb)"/);
  if (!match) return null;

  if (match[1] === "sqlite") return Database.SQLite;
  if (match[1] === "postgresql") return Database.PostgreSQL;
  if (match[1] === "mysql") return Database.MySQL;
  if (match[1] === "mongodb") return Database.MongoDB;
  return null;
};

export const registerSwitchCommand = (program: Command): void => {
  const switchCommand = new Command("switch").description(
    "Switch project configuration"
  );

  switchCommand
    .command("db [database]")
    .description(
      "Switch database provider between sqlite, postgresql, and mysql (schema and config only — data migration is manual)"
    )
    .action(async (database?: string) => {
      try {
        const workingDir = getWorkingDirectory();

        const pkgPath = join(workingDir, "package.json");
        if (!existsSync(pkgPath)) {
          console.error(
            chalk.red("❌ No package.json found. Run from your project root.")
          );
          process.exit(1);
        }

        const currentDb = detectCurrentDatabase(workingDir);
        if (!currentDb) {
          console.error(
            chalk.red(
              "❌ No Prisma database found in this project. Run 'kickpress add db' first."
            )
          );
          process.exit(1);
        }

        if (currentDb === Database.MongoDB) {
          console.error(
            chalk.red(
              "❌ Switching from MongoDB is not supported (MongoDB uses Prisma v6 while other databases use v7).\n" +
              "   Please create a new project with your desired database instead."
            )
          );
          process.exit(1);
        }

        const typescript = existsSync(join(workingDir, "tsconfig.json"));
        const fileExtension = typescript ? "ts" : "js";

        let packageManager: "pnpm" | "npm" | "yarn" = "pnpm";
        if (existsSync(join(workingDir, "pnpm-lock.yaml"))) packageManager = "pnpm";
        else if (existsSync(join(workingDir, "yarn.lock"))) packageManager = "yarn";
        else if (existsSync(join(workingDir, "package-lock.json"))) packageManager = "npm";

        // Resolve target database
        let targetDb: Database;
        if (database) {
          if (database !== "sqlite" && database !== "postgresql" && database !== "mysql") {
            console.error(
              chalk.red("❌ Invalid database. Valid options for switch: sqlite, postgresql, mysql")
            );
            process.exit(1);
          }
          targetDb =
            database === "sqlite"
              ? Database.SQLite
              : database === "mysql"
                ? Database.MySQL
                : Database.PostgreSQL;
          if (targetDb === currentDb) {
            console.error(
              chalk.red(`❌ Already using ${currentDb}. Nothing to switch.`)
            );
            process.exit(1);
          }
        } else {
          targetDb = await select({
            message: `Currently using ${chalk.bold(currentDb)}. Switch to:`,
            choices: [
              { name: "SQLite  (file-based, zero config)", value: Database.SQLite },
              { name: "PostgreSQL  (requires a running server)", value: Database.PostgreSQL },
              { name: "MySQL  (requires a running server)", value: Database.MySQL },
            ].filter((c) => c.value !== currentDb),
          });
        }

        console.log(
          chalk.blue(
            `\n☕ Switching database from ${chalk.bold(currentDb)} to ${chalk.bold(targetDb)}...\n`
          )
        );

        console.log(chalk.yellow("⚠️  Schema and config will be updated."));
        console.log(
          chalk.yellow(
            `   Existing ${currentDb} data will NOT be migrated automatically — back up first.\n`
          )
        );

        const installProd = (pkgs: string) =>
          packageManager === "npm"
            ? `npm install --save ${pkgs}`
            : packageManager === "yarn"
            ? `yarn add ${pkgs}`
            : `pnpm add ${pkgs}`;

        const installDev = (pkgs: string) =>
          packageManager === "npm"
            ? `npm install --save-dev ${pkgs}`
            : packageManager === "yarn"
            ? `yarn add --dev ${pkgs}`
            : `pnpm add --save-dev ${pkgs}`;

        const uninstall = (pkgs: string) =>
          packageManager === "npm"
            ? `npm uninstall ${pkgs}`
            : packageManager === "yarn"
            ? `yarn remove ${pkgs}`
            : `pnpm remove ${pkgs}`;

        const run = (cmd: string) =>
          packageManager === "npm" ? `npm run ${cmd}` : `${packageManager} ${cmd}`;

        if (packageManager === "pnpm") {
          const buildPackages = ["prisma", "@prisma/engines"];
          if (targetDb === Database.SQLite) buildPackages.push("better-sqlite3");
          ensurePnpmAllowBuilds(workingDir, buildPackages);
        }

        // 1. Swap packages
        console.log(chalk.gray("📦 Swapping database adapter packages..."));
        if (currentDb === Database.SQLite) {
          execSync(
            uninstall("better-sqlite3 @prisma/adapter-better-sqlite3 @types/better-sqlite3"),
            { cwd: workingDir, stdio: "inherit" }
          );
          if (targetDb === Database.PostgreSQL) {
            execSync(installProd("@prisma/adapter-pg"), { cwd: workingDir, stdio: "inherit" });
          } else {
            execSync(installProd("@prisma/adapter-mariadb"), { cwd: workingDir, stdio: "inherit" });
          }
        } else if (currentDb === Database.PostgreSQL) {
          execSync(uninstall("@prisma/adapter-pg"), { cwd: workingDir, stdio: "inherit" });
          if (targetDb === Database.SQLite) {
            execSync(installProd("better-sqlite3 @prisma/adapter-better-sqlite3"), { cwd: workingDir, stdio: "inherit" });
            execSync(installDev("@types/better-sqlite3"), { cwd: workingDir, stdio: "inherit" });
          } else {
            execSync(installProd("@prisma/adapter-mariadb"), { cwd: workingDir, stdio: "inherit" });
          }
        } else {
          // currentDb === MySQL
          execSync(uninstall("@prisma/adapter-mariadb"), { cwd: workingDir, stdio: "inherit" });
          if (targetDb === Database.SQLite) {
            execSync(installProd("better-sqlite3 @prisma/adapter-better-sqlite3"), { cwd: workingDir, stdio: "inherit" });
            execSync(installDev("@types/better-sqlite3"), { cwd: workingDir, stdio: "inherit" });
          } else {
            execSync(installProd("@prisma/adapter-pg"), { cwd: workingDir, stdio: "inherit" });
          }
        }

        // 2. Update schema.prisma provider
        console.log(chalk.gray("📝 Updating Prisma schema provider..."));
        const schemaPath = join(workingDir, "prisma", "schema.prisma");
        const schema = readFileSync(schemaPath, "utf-8");
        writeFileSync(
          schemaPath,
          schema.replace(/provider\s*=\s*"\w+"/, `provider = "${targetDb}"`)
        );

        // 3. Update DATABASE_URL in .env
        console.log(chalk.gray("📝 Updating DATABASE_URL in .env..."));
        const envPath = join(workingDir, ".env");
        const newUrl =
          targetDb === Database.SQLite
            ? `"file:./dev.db"`
            : targetDb === Database.MySQL
              ? `"mysql://user:password@localhost:3306/database"`
              : `"postgresql://user:password@host:port/database?schema=public"`;

        if (existsSync(envPath)) {
          let env = readFileSync(envPath, "utf-8");
          if (env.includes("DATABASE_URL")) {
            env = env.replace(/DATABASE_URL=.*/, `DATABASE_URL=${newUrl}`);
          } else {
            env = env.trimEnd() + `\nDATABASE_URL=${newUrl}\n`;
          }
          writeFileSync(envPath, env);
        }

        // 4. Run db:generate against the updated schema
        console.log(chalk.blue("\n📦 Running Prisma generate...\n"));
        execSync(run("db:generate"), { cwd: workingDir, stdio: "inherit" });

        // 5. Only now that the generated client actually exists, regenerate
        // src/lib/prisma — writing it earlier would import a client that isn't there yet
        console.log(chalk.gray("📝 Regenerating Prisma client file..."));
        const prismaClientPath = join(workingDir, "src", "lib", `prisma.${fileExtension}`);
        writeFileSync(prismaClientPath, generatePrismaClient(typescript, targetDb));

        // 6. For SQLite: run db:push. For server DBs: skip (needs real connection string first)
        if (targetDb === Database.SQLite) {
          console.log(chalk.blue("\n📦 Running Prisma push...\n"));
          execSync(run("db:push"), { cwd: workingDir, stdio: "inherit" });
          console.log(chalk.green("\n✅ Switched to SQLite successfully!\n"));
        } else if (targetDb === Database.MySQL) {
          console.log(chalk.green("\n✅ Schema switched to MySQL!\n"));
          console.log(chalk.cyan("Next steps:"));
          console.log(chalk.gray("  1. Set DATABASE_URL in .env to your MySQL connection string"));
          console.log(chalk.gray(`  2. Run: ${run("db:push")}`));
        } else {
          console.log(chalk.green("\n✅ Schema switched to PostgreSQL!\n"));
          console.log(chalk.cyan("Next steps:"));
          console.log(chalk.gray("  1. Set DATABASE_URL in .env to your PostgreSQL connection string"));
          console.log(chalk.gray(`  2. Run: ${run("db:push")}`));
        }
      } catch (error) {
        console.error(
          chalk.red(
            `\n❌ Error switching database: ${(error as Error).message}\n`
          )
        );
        process.exit(1);
      }
    });

  program.addCommand(switchCommand);
};
