import { writeFileSync, mkdirSync } from "fs";

import { join } from "path";

interface ProjectConfig {
  projectName: string;
  projectPath: string;
  typescript: boolean;
  database: string;
  template: string;
}

export const createProjectStructure = (projectPath: string): void => {
  const folders = [
    "src",
    "src/controllers",
    "src/models",
    "src/routes",
    "src/middlewares",
    "src/config",
    "src/utils",
    "src/lib",
    "src/types",
    "public",
    "prisma",
    "requests",
  ];

  folders.forEach((folder) => {
    mkdirSync(join(projectPath, folder), { recursive: true });
  });
};

export const generatePackageJson = (config: ProjectConfig): object => {
  const { projectName, typescript } = config;

  const dependencies: Record<string, string> = {
    express: "^4.18.2",
    "express-async-handler": "^1.2.0",
    "@prisma/client": "^7.1.0",
    "@prisma/adapter-better-sqlite3": "^7.1.0",
    "better-sqlite3": "^9.2.2",
    dotenv: "^17.2.3",
  };

  const devDependencies: Record<string, string> = {
    "@types/node": "^20.10.6",
    "@types/express": "^4.17.21",
    "@types/better-sqlite3": "^7.6.8",
    prisma: "^7.1.0",
  };

  // Add TypeScript dependencies
  if (typescript) {
    devDependencies.typescript = "^5.3.3";
    devDependencies.tsx = "^4.7.0";
  } else {
    dependencies["@prisma/client-runtime-utils"] = "^7.1.0";
  }

  const scripts: Record<string, string> = typescript
    ? {
        dev: "tsx watch --env-file=.env src/index.ts",
        build: "tsc",
        start: "node --env-file=.env dist/index.js",
        "db:generate": "prisma generate",
        "db:push": "prisma db push",
        "db:migrate": "prisma migrate dev",
        "db:studio": "prisma studio",
      }
    : {
        dev: "node --watch --env-file=.env src/index.js",
        start: "node --env-file=.env src/index.js",
        "db:generate": "prisma generate",
        "db:push": "prisma db push",
        "db:migrate": "prisma migrate dev",
        "db:studio": "prisma studio",
      };

  return {
    name: projectName,
    version: "1.0.0",
    type: "module",
    main: typescript ? "dist/index.js" : "src/index.js",
    scripts,
    dependencies,
    devDependencies,
    license: "MIT",
  };
};

export const generateIndexFile = (typescript: boolean): string => {
  if (typescript) {
    return `import express, { Request, Response } from "express";
    
import errorHandler from "./middlewares/error.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Welcome to Kickpress!" });
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
app.use(express.static("public"));

// Routes
app.get("/", (_, res) => {
  res.json({ message: "Welcome to Kickpress!" });
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`;
};

export const generateErrorMiddleware = (typescript: boolean): string => {
  if (typescript) {
    return `import { Prisma } from "../lib/generated/prisma/client";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
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
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
`;
  }

  return `const errorHandler = (err, req, res, next) => {
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
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
`;
};

export const generatePrismaClient = (typescript: boolean): string => {
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

export const generatePrismaSchema = (): string => {
  return `generator client {
  provider = "prisma-client"
  output   = "../src/lib/generated/prisma"
}

datasource db {
  provider = "sqlite"
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

export const generateTsConfig = (): string => {
  return JSON.stringify(
    {
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
        paths: {
          "@/*": ["./src/*"],
        },
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"],
    },
    null,
    2
  );
};

export const generateEnvFile = (database: string): string => {
  return `PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
`;
};

export const generateGitignore = (): string => {
  return `node_modules
.env
.env.local
dist
*.log
.DS_Store

# Prisma
*.db
*.db-journal
src/lib/generated/
`;
};

export const generateReadme = (
  projectName: string,
  typescript: boolean,
  packageManager: string
): string => {
  const pm = packageManager;
  const runCmd = pm === "npm" ? "npm run" : pm;

  return `# ${projectName}

Created with [Kickpress CLI](https://github.com/clebertmarctyson/kickpress) ☕

A production-ready Express.js API with TypeScript, Prisma ORM, and best practices built-in.

## 🚀 Getting Started

${
  pm === "pnpm"
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

### 2. Setup Database

\`\`\`bash
# Generate Prisma Client
${runCmd} db:generate

# Push schema to database
${runCmd} db:push
\`\`\`

### 3. Start Development Server

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
}### Database Management
- \`${runCmd} db:generate\` - Generate Prisma Client
- \`${runCmd} db:push\` - Push schema changes to database
- \`${runCmd} db:migrate\` - Create a new migration
- \`${runCmd} db:studio\` - Open Prisma Studio (database GUI)

## 🎯 Generate Resources

Kickpress can generate complete CRUD resources for any entity:

\`\`\`bash
# Generate everything (routes, controller, model, types, HTTP requests)
npx kickpress make user resources
npx kickpress gen post resources     # Short alias

# Generate individual components
npx kickpress make user model
npx kickpress make user controller
npx kickpress make user routes
\`\`\`

**Available aliases:**
- \`make\` / \`m\` / \`gen\` / \`g\` / \`generate\`

## 📁 Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── index.${typescript ? "ts" : "js"}           # Main entry point
│   ├── lib/
│   │   └── prisma.${typescript ? "ts" : "js"}      # Prisma client
│   ├── controllers/                  # Request handlers
│   ├── models/                       # Database operations
│   ├── routes/                       # Express routes
${
  typescript ? "│   ├── types/                        # TypeScript types\n" : ""
}│   ├── middlewares/
│   │   └── error.middleware.${typescript ? "ts" : "js"}
│   ├── config/                       # Configuration
│   └── utils/                        # Utilities
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations
├── requests/                         # HTTP test files
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

\`\`\`env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
\`\`\`

## 🛠️ Technology Stack

- **Express.js** - Fast, minimalist web framework
${typescript ? "- **TypeScript** - Type-safe JavaScript\n" : ""}${
    typescript ? "- **tsx** - TypeScript execution engine\n" : ""
  }- **Prisma** - Next-generation ORM
- **SQLite** - Default database (easily swappable)
- **express-async-handler** - Async error handling

## 📚 Learn More

- [Kickpress Documentation](https://github.com/clebertmarctyson/kickpress#readme)
- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
${typescript ? "- [TypeScript Docs](https://www.typescriptlang.org/)\n" : ""}
## 🐛 Troubleshooting

### Port already in use
Change the port in \`.env\`:
\`\`\`env
PORT=3001
\`\`\`

### Prisma Client errors
Regenerate the Prisma client:
\`\`\`bash
${runCmd} db:generate
\`\`\`
${
  pm === "pnpm"
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
  packageManager: string
): void => {
  const { projectPath, projectName, typescript, database } = config;

  // Write package.json
  writeFileSync(
    join(projectPath, "package.json"),
    JSON.stringify(generatePackageJson(config), null, 2)
  );

  // Write main index file
  const extension = typescript ? "ts" : "js";
  writeFileSync(
    join(projectPath, "src", `index.${extension}`),
    generateIndexFile(typescript)
  );

  // Write Prisma client
  writeFileSync(
    join(projectPath, "src", "lib", `prisma.${extension}`),
    generatePrismaClient(typescript)
  );

  // Write error middleware
  writeFileSync(
    join(projectPath, "src", "middlewares", `error.middleware.${extension}`),
    generateErrorMiddleware(typescript)
  );

  // Write Prisma files
  writeFileSync(
    join(projectPath, "prisma", "schema.prisma"),
    generatePrismaSchema()
  );

  writeFileSync(join(projectPath, "prisma.config.ts"), generatePrismaConfig());

  // Write tsconfig.json if TypeScript
  if (typescript) {
    writeFileSync(join(projectPath, "tsconfig.json"), generateTsConfig());
  }

  // Write other files
  writeFileSync(join(projectPath, ".env"), generateEnvFile(database));
  writeFileSync(join(projectPath, ".gitignore"), generateGitignore());
  writeFileSync(
    join(projectPath, "README.md"),
    generateReadme(projectName, typescript, packageManager)
  );
};
