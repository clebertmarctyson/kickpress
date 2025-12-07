import { Command } from "commander";

import { getPackageJson } from "@/lib/utils/file.js";

import {
  registerFreshCommand,
  registerInventCommand,
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
  $ npx kickpress kick my-api                    Create a new Express.js project
  $ npx kickpress kick my-api --no-typescript    Create a JavaScript project
  $ npx kickpress kick                           Interactive mode (prompts for all options)
  
  $ npx kickpress make user resources             Generate full CRUD for user entity
  $ npx kickpress make post routes                Generate only routes for post entity
  $ npx kickpress make comment controller         Generate only controller for comment entity
  $ npx kickpress make product model              Generate only model for product entity

Quick Start:
  1. Create a new project:
    $ npx kickpress kick my-api
  
  2. Navigate to your project:
    $ cd my-api
  
  3. Start development server (dependencies already installed):
    $ pnpm dev
    $ npm run dev
    $ yarn dev
  
  4. Generate resources:
    $ npx kickpress make post resources
  
  Your API is now running at http://localhost:3000! 🎉

Features:
  ✓ Instant setup with auto-installation
  ✓ TypeScript first (JavaScript optional)
  ✓ Prisma ORM pre-configured
  ✓ CRUD generation with type safety
  ✓ Auto-injection of routes
  ✓ Comprehensive error handling
  ✓ HTTP request test files
  ✓ Zero configuration needed

Learn more:
  Documentation: https://github.com/clebertmarctyson/kickpress#readme
  Report issues: https://github.com/clebertmarctyson/kickpress/issues
  
Made with ☕ and ❤️ by Marc Tyson CLEBERT
    `
  );

// Register commands
registerFreshCommand(program);
registerInventCommand(program);

program.on("command:*", (operands) => {
  console.error(`❌ Unknown command: ${operands[0]}`);
  console.error(`Run 'kickpress --help' to see available commands`);
  process.exit(1);
});

export default program;
