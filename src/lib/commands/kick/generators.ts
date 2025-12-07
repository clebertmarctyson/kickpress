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

  return `# ${projectName}

Created with Kickpress CLI

## Getting Started

### 1. Install dependencies
\`\`\`bash
${pm} install
\`\`\`

### 2. Setup Database
\`\`\`bash
# Generate Prisma Client
${pm} run db:generate

# Push schema to database
${pm} run db:push
\`\`\`

### 3. Run development server
\`\`\`bash
${pm} run dev
\`\`\`

## Available Commands

- \`${pm} run dev\` - Start development server with hot reload
${typescript ? `- \`${pm} run build\` - Build for production` : ""}
- \`${pm} start\` - Start production server
- \`${pm} run db:generate\` - Generate Prisma Client
- \`${pm} run db:push\` - Push schema changes to database
- \`${pm} run db:migrate\` - Create migration
- \`${pm} run db:studio\` - Open Prisma Studio

## Generate Resources

\`\`\`bash
# Generate full CRUD for an entity
npx kickpress make user resources

# Or individual parts
npx kickpress make user model
npx kickpress make user controller
npx kickpress make user routes
\`\`\`
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
