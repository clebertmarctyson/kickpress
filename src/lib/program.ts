import { Command } from "commander";

import { getPackageJson } from "@/lib/utils/file.js";

import {
  registerFreshCommand,
  registerInventCommand,
  registerAddCommand,
} from "@/lib/commands/index.js";

const packageJson = getPackageJson();

const program = new Command();

program
  .name("kickpress")
  .description(
    "A fast and opinionated CLI for scaffolding Express.js projects with TypeScript, Prisma, and best practices built-in"
  )
  .version(
    packageJson.version as string,
    "-v, --version",
    "Display version number"
  )
  .showHelpAfterError("(add --help for additional information)")
  .showSuggestionAfterError()
  .addHelpText(
    "after",
    `
Examples:
  # Start a new project (interactive)
  $ npx kickpress init
  $ npx kickpress init my-api

  # Templates: api | npm | cli | web
  $ npx kickpress init my-api -t api -d sqlite
  $ npx kickpress init my-api -t api -d postgresql
  $ npx kickpress init my-api -t api -d none
  $ npx kickpress init my-lib  -t npm
  $ npx kickpress init my-tool -t cli
  $ npx kickpress init my-site -t web

  # Accept all defaults (TypeScript, api, sqlite, pnpm)
  $ npx kickpress init my-api -y
  $ npx kickpress in  my-api -y

  # Generate all CRUD resources for an entity
  $ npx kickpress make user
  $ npx kickpress make post --table posts --route /posts

  # Add database to an existing project
  $ npx kickpress add db
  $ npx kickpress add db sqlite
  $ npx kickpress add db postgresql

Quick Start:
  1. $ npx kickpress init my-api -y
  2. $ cd my-api
  3. $ pnpm dev          (or npm run dev / yarn dev)
  4. $ npx kickpress make post

Features:
  ✓ Templates: REST API, NPM package, CLI tool, Web app
  ✓ TypeScript first (JavaScript optional)
  ✓ Database optional — SQLite or PostgreSQL via Prisma
  ✓ Full CRUD generation with type safety
  ✓ Service layer generation
  ✓ Auto-injection of routes into index
  ✓ HTTP request test files (.http)
  ✓ Zero configuration needed

Learn more:
  Documentation: https://github.com/clebertmarctyson/kickpress#readme
  Report issues:  https://github.com/clebertmarctyson/kickpress/issues
    `
  );

// Register commands
registerFreshCommand(program);
registerInventCommand(program);
registerAddCommand(program);

program.on("command:*", (operands) => {
  console.error(`❌ Unknown command: ${operands[0]}`);
  console.error(`Run 'kickpress --help' to see available commands`);
  process.exit(1);
});

export default program;
