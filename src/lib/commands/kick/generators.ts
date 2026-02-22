import { writeFileSync, mkdirSync } from "fs";

import { Database, ProjectConfig } from "@/lib/types/index.js";

import { join } from "path";

export const createProjectStructure = (
  projectPath: string,
  database: Database,
  template: string,
): void => {
  const common = ["src", "src/utils", "src/lib", "src/types"];

  let folders: string[] = [];

  switch (template) {
    case "npm":
      folders = ["src"];
      break;
    case "cli":
      folders = [...common, "src/commands", "src/bin"];
      break;
    case "web":
      folders = [...common, "src/middlewares", "public"];
      break;
    case "api":
    default:
      folders = [
        ...common,
        "src/controllers",
        "src/models",
        "src/routes",
        "src/validations",
        "src/middlewares",
        "src/config",
        "src/services",
        "requests",
      ];
  }

  if (database !== Database.None) {
    folders.push("prisma");
  }

  folders.forEach((folder) => {
    mkdirSync(join(projectPath, folder), { recursive: true });
  });
};

export const generatePackageJson = (config: ProjectConfig): object => {
  const { projectName, typescript, database, template } = config;

  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {
    "@types/node": "^25.3.0",
  };

  // Template-specific deps and scripts
  const scripts: Record<string, string> = {};

  if (template === "npm") {
    // Pure library — no runtime deps beyond what the user adds
    if (typescript) {
      devDependencies.typescript = "^5.9.3";
      devDependencies.tsx = "^4.21.0";
      scripts.dev = "tsc --watch";
      scripts.build = "tsc";
      scripts.prepublishOnly = "npm run build";
    } else {
      scripts.dev = "node --watch src/index.js";
      scripts.prepublishOnly = "echo 'Ready to publish'";
    }

    const pkg: any = {
      name: projectName,
      version: "0.1.0",
      type: "module",
      main: typescript ? "dist/index.js" : "src/index.js",
      ...(typescript && { types: "dist/index.d.ts" }),
      exports: {
        ".": {
          ...(typescript && { types: "./dist/index.d.ts" }),
          default: typescript ? "./dist/index.js" : "./src/index.js",
        },
      },
      files: ["dist", "README.md"],
      scripts,
      dependencies,
      devDependencies,
      license: "MIT",
    };
    return pkg;
  }

  if (template === "cli") {
    dependencies.commander = "^14.0.0";
    if (typescript) {
      devDependencies.tsx = "^4.21.0";
      scripts.dev = "tsx watch src/cli.ts";
      scripts.build = "tsc";
      scripts.start = "node dist/cli.js";
    } else {
      scripts.dev = "node --watch src/cli.js";
      scripts.start = "node src/cli.js";
    }
  } else {
    // api / web — Express-based
    dependencies.express = "^5.2.1";
    dependencies["express-async-handler"] = "^1.2.0";
    dependencies.zod = "^4.3.6";
    dependencies.dotenv = "^17.3.1";
    devDependencies["@types/express"] = "^5.0.6";

    if (database !== Database.None) {
      if (database === Database.SQLite) {
        dependencies["better-sqlite3"] = "^12.6.2";
        dependencies["@prisma/adapter-better-sqlite3"] = "^7.4.1";
        devDependencies["@types/better-sqlite3"] = "^7.6.13";
      } else if (database === Database.PostgreSQL) {
        dependencies["@prisma/adapter-pg"] = "^7.4.1";
      }
      dependencies["@prisma/client"] = "^7.4.1";
      devDependencies.prisma = "^7.4.1";
      scripts["db:generate"] = "prisma generate";
      scripts["db:push"] = "prisma db push";
      scripts["db:migrate"] = "prisma migrate dev";
      scripts["db:studio"] = "prisma studio";
    }

    if (typescript) {
      scripts.dev = "tsx watch --env-file=.env src/index.ts";
      scripts.build = "tsc";
      scripts.start = "node --env-file=.env dist/index.js";
    } else {
      scripts.dev = "node --watch --env-file=.env src/index.js";
      scripts.start = "node --env-file=.env src/index.js";
    }
  }

  if (typescript) {
    devDependencies.typescript = "^5.9.3";
    devDependencies.tsx = "^4.21.0";
  }

  const pkg: any = {
    name: projectName,
    version: "1.0.0",
    type: "module",
    main: typescript ? "dist/index.js" : "src/index.js",
    scripts,
    dependencies,
    devDependencies,
    license: "MIT",
  };

  if (template === "cli") {
    pkg.bin = {
      [projectName]: typescript ? "dist/cli.js" : "src/cli.js",
    };
  }

  return pkg;
};

export const generateIndexFile = (typescript: boolean, template: string): string => {
  const isWeb = template === "web";

  if (typescript) {
    return `import express, { Request, Response } from "express";

import errorHandler from "./middlewares/error.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
${isWeb ? 'app.use(express.static("public"));\n' : ""}
// Routes
app.get("/api", (_: Request, res: Response) => {
  res.json({ message: "Welcome to my app" });
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`;
  }

  return `import express from "express";

import errorHandler from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
${isWeb ? 'app.use(express.static("public"));\n' : ""}
// Routes
app.get("/api", (_, res) => {
  res.json({ message: "Welcome to my app" });
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`;
};

export const generateErrorMiddleware = (
  typescript: boolean,
  withDatabase = false,
): string => {
  if (typescript) {
    if (withDatabase) {
      return `import { Prisma } from "../lib/generated/prisma/client";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error | Prisma.PrismaClientKnownRequestError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message: string | object = err.message;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = \`Duplicate field value: \${err.meta?.target}\`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = \`Resource not found: \${err.meta?.cause}\`;
    }
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
`;
    }

    return `import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
`;
  }

  if (withDatabase) {
    return `const errorHandler = (err, _req, res, _next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  // Handle Prisma errors
  if (err.code === "P2002") {
    statusCode = 409;
    message = \`Duplicate field value: \${err.meta?.target}\`;
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = \`Resource not found: \${err.meta?.cause}\`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
`;
  }

  return `const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
`;
};

export const generatePrismaClient = (
  typescript: boolean,
  database: Database,
): string => {
  if (database === Database.PostgreSQL) {
    if (typescript) {
      return `import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
`;
    }

    return `import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
`;
  }

  // SQLite
  if (typescript) {
    return `import { PrismaClient } from "./generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
`;
  }

  return `import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
`;
};

export const generatePrismaSchema = (provider: string): string => {
  return `generator client {
  provider = "prisma-client"
  output   = "../src/lib/generated/prisma"
}

datasource db {
  provider = "${provider}"
}

`;
};

export const generatePrismaConfig = (): string => {
  return `import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
`;
};

export const generateTsConfig = (npmPackage = false): string => {
  const base = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
      types: ["node"],
      ...(npmPackage
        ? { declaration: true, declarationDir: "./dist" }
        : { paths: { "@/*": ["./src/*"] } }),
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  };
  return JSON.stringify(base, null, 2);
};

export const generateEnvFile = (database: string): string => {
  return `PORT=3000
NODE_ENV=development
DATABASE_URL="${database}"
`;
};

export const generateNpmIgnore = (): string => {
  return `src/
*.ts
!dist/
node_modules/
.env
*.log
.DS_Store
tsconfig.json
`;
};

export const generateGitignore = (withDatabase = false): string => {
  return `node_modules
.env
.env.local
dist
*.log
.DS_Store
${
  withDatabase
    ? `
# Prisma
*.db
*.db-journal
src/lib/generated/
`
    : ""
}`;
};

export const generateReadme = (
  projectName: string,
  typescript: boolean,
  packageManager: string,
  database: Database,
  template = "api",
): string => {
  const pm = packageManager;
  const runCmd = pm === "npm" ? "npm run" : pm;

  // ── NPM PACKAGE README ────────────────────────────────────────────────────
  if (template === "npm") {
    return `# ${projectName}

A brief description of your package.

## Installation

\`\`\`bash
npm install ${projectName}
\`\`\`

## Usage

\`\`\`${typescript ? "typescript" : "javascript"}
import { hello } from "${projectName}";

console.log(hello("World")); // Hello, World!
\`\`\`

## Development

\`\`\`bash
# Watch mode
${runCmd} dev

# Build
${runCmd} build
\`\`\`

## Publishing

\`\`\`bash
npm publish
\`\`\`

---

Made with ☕ and ❤️ by [Kickpress](https://github.com/clebertmarctyson/kickpress)
`;
  }

  // ── CLI README ────────────────────────────────────────────────────────────
  if (template === "cli") {
    return `# ${projectName}

A Node.js CLI tool.

## Installation

\`\`\`bash
npm install -g ${projectName}
\`\`\`

## Usage

\`\`\`bash
${projectName} hello
\`\`\`

## Development

\`\`\`bash
# Watch mode
${runCmd} dev

# Build
${runCmd} build

# Run locally
${runCmd} start
\`\`\`

---

Made with ☕ and ❤️ by [Kickpress](https://github.com/clebertmarctyson/kickpress)
`;
  }

  const databaseSetupSection =
    database === "none"
      ? `### 2. Start Development Server`
      : database === "postgresql"
      ? `### 2. Configure Database

Update your \`.env\` file with your PostgreSQL connection string:

\`\`\`env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
\`\`\`

Example:
\`\`\`env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mydb?schema=public"
\`\`\`

### 3. Setup Database Schema

\`\`\`bash
# Generate Prisma Client
${runCmd} db:generate

# Push schema to database
${runCmd} db:push
\`\`\`

### 4. Start Development Server`
      : `### 2. Setup Database

\`\`\`bash
# Generate Prisma Client
${runCmd} db:generate

# Push schema to database
${runCmd} db:push
\`\`\`

### 3. Start Development Server`;

  const envVarsSection =
    database === "none"
      ? `\`\`\`env
PORT=3000
NODE_ENV=development
\`\`\``
      : database === "postgresql"
      ? `\`\`\`env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
\`\`\``
      : `\`\`\`env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
\`\`\``;

  const techStackDatabase =
    database === "none"
      ? ""
      : database === "postgresql"
      ? "- **PostgreSQL** - Powerful, open source object-relational database"
      : "- **SQLite** - Default database (easily swappable)";

  return `# ${projectName}

Created with [Kickpress CLI](https://github.com/clebertmarctyson/kickpress) ☕

A production-ready Express.js API with TypeScript, Prisma ORM, and best practices built-in.

## 🚀 Getting Started

${
  pm === "pnpm" && database === "sqlite"
    ? `### ⚠️ Important: Approve Native Builds (pnpm only)

Before running the project, you need to approve native dependencies:

\`\`\`bash
pnpm approve-builds
# Select: better-sqlite3 (press space, then enter)
\`\`\`

This is a one-time setup required by pnpm for native dependencies.

---

`
    : ""
}### 1. Install Dependencies

${
  pm === "pnpm"
    ? "Dependencies should already be installed. If not, run:"
    : "Install all project dependencies:"
}

\`\`\`bash
${pm} install
\`\`\`

${databaseSetupSection}

\`\`\`bash
${runCmd} dev
\`\`\`

Your API is now running at \`http://localhost:3000\`! 🎉

## 📋 Available Commands

### Development
- \`${runCmd} dev\` - Start development server with hot reload

${
  typescript
    ? `### Build
- \`${runCmd} build\` - Compile TypeScript to JavaScript
- \`${runCmd} start\` - Start production server

`
    : `### Production
- \`${runCmd} start\` - Start production server

`
}${
  database !== "none"
    ? `### Database Management
- \`${runCmd} db:generate\` - Generate Prisma Client
- \`${runCmd} db:push\` - Push schema changes to database
- \`${runCmd} db:migrate\` - Create a new migration
- \`${runCmd} db:studio\` - Open Prisma Studio (database GUI)

`
    : ""
}## 🎯 Generate Resources

Kickpress can generate complete CRUD resources for any entity:

\`\`\`bash
# Generate all resources (model, service, controller, routes, validations, HTTP requests)
npx kickpress make user
\`\`\`

## 📁 Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── index.${typescript ? "ts" : "js"}           # Main entry point
${
  database !== "none"
    ? `│   ├── lib/\n│   │   └── prisma.${typescript ? "ts" : "js"}      # Prisma client\n`
    : ""
}│   ├── controllers/                  # Request handlers
│   ├── models/                       # Database operations
│   ├── routes/                       # Express routes
${
  typescript ? "│   ├── types/                        # TypeScript types\n" : ""
}│   ├── middlewares/
│   │   └── error.middleware.${typescript ? "ts" : "js"}
│   ├── config/                       # Configuration
│   └── utils/                        # Utilities
${
  database !== "none"
    ? `├── prisma/\n│   ├── schema.prisma                 # Database schema\n│   └── migrations/                   # Database migrations\n`
    : ""
}├── requests/                         # HTTP test files
├── .env                              # Environment variables
${
  typescript
    ? "├── tsconfig.json                     # TypeScript config\n"
    : ""
}└── package.json
\`\`\`

## 🧪 Testing Your API

Each generated resource includes an \`.http\` file for testing. Use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in VS Code:

1. Open \`requests/user.http\`
2. Click "Send Request" above any request
3. View response in VS Code

Or use curl:

\`\`\`bash
# Get all users
curl http://localhost:3000/users

# Create a user
curl -X POST http://localhost:3000/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com"}'
\`\`\`

## 📝 Environment Variables

Edit \`.env\` to configure your application:

${envVarsSection}

## 🛠️ Technology Stack

- **Express.js** - Fast, minimalist web framework
${typescript ? "- **TypeScript** - Type-safe JavaScript\n" : ""}${
    typescript ? "- **tsx** - TypeScript execution engine\n" : ""
  }${database !== "none" ? "- **Prisma** - Next-generation ORM\n" : ""}${techStackDatabase ? techStackDatabase + "\n" : ""}- **express-async-handler** - Async error handling

## 📚 Learn More

- [Kickpress Documentation](https://github.com/clebertmarctyson/kickpress#readme)
- [Express.js Docs](https://expressjs.com/)
${database !== "none" ? "- [Prisma Docs](https://www.prisma.io/docs)\n" : ""}${typescript ? "- [TypeScript Docs](https://www.typescriptlang.org/)\n" : ""}${
    database === "postgresql"
      ? "- [PostgreSQL Docs](https://www.postgresql.org/docs/)\n"
      : ""
  }
## 🐛 Troubleshooting

### Port already in use
Change the port in \`.env\`:
\`\`\`env
PORT=3001
\`\`\`

${
  database !== "none"
    ? `### Prisma Client errors
Regenerate the Prisma client:
\`\`\`bash
${runCmd} db:generate
\`\`\`
`
    : ""
}${
  database === "postgresql"
    ? `
### Database connection errors
Make sure:
1. PostgreSQL is running
2. DATABASE_URL in \`.env\` is correct
3. Database exists and is accessible
4. User has proper permissions

You can test the connection with:
\`\`\`bash
psql "${process.env.DATABASE_URL}"
\`\`\`
`
    : ""
}${
    pm === "pnpm" && database === "sqlite"
      ? `
### Module not found errors (pnpm)
Make sure you've approved native builds:
\`\`\`bash
pnpm approve-builds
# Select: better-sqlite3
\`\`\`
`
      : ""
  }
## 💬 Support

- 🐛 [Report Issues](https://github.com/clebertmarctyson/kickpress/issues)
- 💡 [Request Features](https://github.com/clebertmarctyson/kickpress/issues/new)
- 📧 Email: contact@marctysonclebert.com

---

Made with ☕ and ❤️ by [Marc Tyson CLEBERT](https://www.marctysonclebert.com)
`;
};

export const writeProjectFiles = (
  config: ProjectConfig,
  packageManager: string,
): void => {
  const { projectPath, projectName, typescript, database, template } = config;
  const extension = typescript ? "ts" : "js";

  // Write package.json
  writeFileSync(
    join(projectPath, "package.json"),
    JSON.stringify(generatePackageJson(config), null, 2),
  );

  // TS config when needed
  if (typescript) {
    writeFileSync(
      join(projectPath, "tsconfig.json"),
      generateTsConfig(template === "npm"),
    );
  }

  // Common files
  writeFileSync(join(projectPath, ".gitignore"), generateGitignore(database !== Database.None));
  writeFileSync(
    join(projectPath, "README.md"),
    generateReadme(projectName, typescript, packageManager, database, template),
  );

  // ── NPM PACKAGE ──────────────────────────────────────────────────────────
  if (template === "npm") {
    writeFileSync(join(projectPath, ".npmignore"), generateNpmIgnore());

    const libEntry = typescript
      ? `/**
 * ${projectName}
 * A brief description of your package.
 */

export const hello = (name: string): string => \`Hello, \${name}!\`;
`
      : `/**
 * ${projectName}
 * A brief description of your package.
 */

export const hello = (name) => \`Hello, \${name}!\`;
`;
    writeFileSync(join(projectPath, "src", `index.${extension}`), libEntry);
    return; // no .env, no Prisma, no Express
  }

  // ── CLI ──────────────────────────────────────────────────────────────────
  if (template === "cli") {
    const cliContent = `#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();
program
  .name(process.env.npm_package_name || "${projectName}")
  .description("${projectName} CLI")
  .version("0.0.1");

program
  .command("hello")
  .description("Say hello")
  .action(() => {
    console.log("Hello from ${projectName} CLI");
  });

program.parse();
`;
    writeFileSync(join(projectPath, "src", `cli.${extension}`), cliContent);
    return; // no .env, no Prisma
  }

  // ── EXPRESS-BASED (api / web) ─────────────────────────────────────────────
  writeFileSync(
    join(projectPath, "src", `index.${extension}`),
    generateIndexFile(typescript, template),
  );
  writeFileSync(
    join(projectPath, "src", "middlewares", `error.middleware.${extension}`),
    generateErrorMiddleware(typescript, database !== Database.None),
  );

  if (template === "web") {
    writeFileSync(
      join(projectPath, "public", "index.html"),
      `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <h1>Welcome to ${projectName}</h1>
    <div id="root"></div>
    <script src="/app.js"></script>
  </body>
</html>`,
    );
    writeFileSync(
      join(projectPath, "public", "styles.css"),
      `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; padding: 2rem; }
h1 { margin-bottom: 1rem; }
`,
    );
    writeFileSync(
      join(projectPath, "public", "app.js"),
      `console.log("${projectName} running");
`,
    );
  }

  // Prisma / DB files if database selected
  if (database !== Database.None) {
    // Write Prisma files
    writeFileSync(
      join(projectPath, "prisma.config.ts"),
      generatePrismaConfig(),
    );
    writeFileSync(
      join(projectPath, "prisma", "schema.prisma"),
      generatePrismaSchema(database),
    );
    writeFileSync(
      join(projectPath, "src", "lib", `prisma.${extension}`),
      generatePrismaClient(typescript, database),
    );

    writeFileSync(
      join(projectPath, ".env"),
      generateEnvFile(
        database === Database.SQLite
          ? "file:./dev.db"
          : database === Database.PostgreSQL
            ? "postgresql://user:password@host:port/database?schema=public"
            : "",
      ),
    );
  } else {
    // Write .env without DATABASE_URL
    writeFileSync(
      join(projectPath, ".env"),
      `PORT=3000\nNODE_ENV=development\n`,
    );
  }
};
