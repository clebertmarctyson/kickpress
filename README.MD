# ☕ Kickpress CLI

> A fast and opinionated CLI for scaffolding Express.js projects with TypeScript, Prisma, and best practices built-in.

Kickpress helps you create production-ready Express.js APIs in seconds, with full CRUD generation, type safety, and modern tooling.

[![npm version](https://img.shields.io/npm/v/kickpress.svg)](https://www.npmjs.com/package/kickpress)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [☕ Kickpress CLI](#-kickpress-cli)
  - [Table of Contents](#table-of-contents)
  - [✨ Features](#-features)
  - [⚡ Why Kickpress?](#-why-kickpress)
  - [📋 Requirements](#-requirements)
  - [🚀 Quick Start](#-quick-start)
  - [⚠️ Important: Using pnpm](#️-important-using-pnpm)
  - [📦 Installation](#-installation)
  - [📖 Command Reference](#-command-reference)
    - [`kick` - Create a New Project](#kick---create-a-new-project)
    - [`make` - Generate Resources](#make---generate-resources)
  - [📋 Complete Workflow Example](#-complete-workflow-example)
    - [1. Create Project](#1-create-project)
    - [2. Generate Resources](#2-generate-resources)
    - [3. Customize Schema](#3-customize-schema)
    - [4. Update Database](#4-update-database)
    - [5. Start Development](#5-start-development)
    - [6. Test Your API](#6-test-your-api)
  - [📁 Generated Project Structure](#-generated-project-structure)
  - [🎨 Generated Code Examples](#-generated-code-examples)
    - [Controller](#controller)
    - [Routes](#routes)
    - [Model](#model)
  - [🔧 Available Scripts](#-available-scripts)
  - [🛠️ Technology Stack](#️-technology-stack)
    - [Core](#core)
    - [Development](#development)
    - [Database](#database)
  - [🎯 Key Features Explained](#-key-features-explained)
    - [1. Automatic Setup](#1-automatic-setup)
    - [2. Type Safety](#2-type-safety)
    - [3. Error Handling](#3-error-handling)
    - [4. Smart Pluralization](#4-smart-pluralization)
    - [5. Auto-Injection](#5-auto-injection)
    - [6. Modern Node.js](#6-modern-nodejs)
  - [🧪 Testing Your API](#-testing-your-api)
    - [Using HTTP Files](#using-http-files)
    - [Using curl](#using-curl)
  - [🐛 Troubleshooting](#-troubleshooting)
    - [pnpm: "Cannot find module" errors](#pnpm-cannot-find-module-errors)
    - [Prisma Client errors](#prisma-client-errors)
    - [Port already in use](#port-already-in-use)
  - [📝 Configuration](#-configuration)
    - [Environment Variables](#environment-variables)
    - [Prisma Configuration](#prisma-configuration)
  - [❓ FAQ](#-faq)
  - [🤝 Contributing](#-contributing)
  - [👤 Author](#-author)
  - [📄 License](#-license)
  - [💬 Support](#-support)

## ✨ Features

- 🚀 **Instant Setup** - Create a complete Express.js project in seconds with auto-installation
- 📦 **TypeScript First** - Full TypeScript support with proper types (JavaScript optional)
- 🗄️ **Prisma ORM** - Pre-configured with SQLite adapter and automatic migrations
- 🎯 **CRUD Generation** - Generate routes, controllers, and models instantly
- 🔄 **Auto-injection** - Routes automatically added to your app
- ⚡ **Modern Stack** - Express, Prisma, tsx, and express-async-handler
- 🛡️ **Error Handling** - Comprehensive error middleware included
- 📝 **HTTP Requests** - Test files generated for each resource
- 🎨 **Best Practices** - Follows industry standards and conventions
- ⚙️ **Zero Configuration** - Everything works out of the box

## ⚡ Why Kickpress?

| Task                 | Manual Setup          | With Kickpress  |
| -------------------- | --------------------- | --------------- |
| Project Setup        | 15-30 minutes         | 30 seconds      |
| Prisma Configuration | Manual config         | Auto-configured |
| CRUD Generation      | Write from scratch    | 1 command       |
| Error Handling       | Custom implementation | Built-in        |
| Type Safety          | Manual types          | Auto-generated  |
| Route Registration   | Manual import         | Auto-injected   |
| Database Setup       | Multiple commands     | Automated       |

## 📋 Requirements

- **Node.js**: v20.0.0 or higher (for `--env-file` support)
- **Package Manager**: npm, pnpm, or yarn
- **Operating System**: macOS, Linux, or Windows

> **Note**: Kickpress uses Node.js native `--env-file` flag. For Node.js < v20, you may need additional configuration.

## 🚀 Quick Start

```bash
# Create a new project
npx kickpress kick my-api

# Navigate to project
cd my-api

# Start development server (dependencies already installed!)
pnpm dev
```

Your API is now running at `http://localhost:3000`! 🎉

> **Note:** Dependencies and database are automatically set up during project creation. No manual installation needed!

## ⚠️ Important: Using pnpm

If you use **pnpm** as your package manager, you might need to approve native builds:

```bash
pnpm approve-builds
# Select: better-sqlite3 (press space, then enter)
```

This is a one-time setup required by pnpm for native dependencies. **npm** and **yarn** work without this step.

## 📦 Installation

No installation required! Use `npx` to run commands directly:

```bash
npx kickpress kick my-project
```

Or install globally:

```bash
npm install -g kickpress
```

## 📖 Command Reference

### `kick` - Create a New Project

Creates a complete Express.js project with all dependencies and folder structure. **Automatically installs dependencies and sets up the database.**

**Syntax:**

```bash
kickpress kick [project-name] [options]
```

**Aliases:** `k`, `new`, `n`, `create`, `c`, `init`, `i`

**Arguments:**

- `project-name` - Name of your project (optional, will prompt if not provided)

**Options:**

- `-t, --template <template>` - Template to use (default: "default")
- `-d, --database <database>` - Database provider: sqlite | postgresql | mysql | mongodb (default: "sqlite")
- `--typescript` - Use TypeScript (default: true)
- `--no-typescript` - Use JavaScript instead
- `-h, --help` - Display help for command

**Examples:**

```bash
# Interactive mode (recommended for first-time users)
npx kickpress kick

# Quick TypeScript project with default settings
npx kickpress kick my-api

# Using aliases
npx kickpress k my-api

npx kickpress new my-api
npx kickpress n my-api

npx kickpress create my-api
npx kickpress c my-api

npx kickpress init my-api
npx kickpress i my-api

# JavaScript project
npx kickpress kick my-api --no-typescript
```

**What it does automatically:**

- ✅ Creates complete folder structure
- ✅ Generates all configuration files
- ✅ Installs all dependencies
- ✅ Generates Prisma Client
- ✅ Pushes initial schema to database
- ✅ Sets up error handling middleware
- ✅ Configures TypeScript/JavaScript

---

### `make` - Generate Resources

Generates CRUD resources for any entity with full type safety. **Automatically updates database after generation.**

**Syntax:**

```bash
kickpress make <entity> <component> [options]
```

**Aliases:** `m`, `generate`, `gen`, `g`

**Arguments:**

- `entity` - Name of the entity (singular, e.g., user, post, product)
- `component` - What to generate:
  - `resources` - Everything (routes, controller, model, types, schema, HTTP requests)
  - `routes` - Only route definitions
  - `controller` - Only controller logic
  - `model` - Only Prisma model operations

**Options:**

- `-f, --force` - Overwrite existing files
- `-h, --help` - Display help for command

**Examples:**

```bash
# Generate everything for user entity (recommended)
npx kickpress make user resources

# Using aliases
npx kickpress m category resources
npx kickpress generate post resources
npx kickpress gen post resources
npx kickpress g product resources

# Generate only specific components
npx kickpress make comment routes
npx kickpress make order controller
npx kickpress make product model

# Force overwrite existing files
npx kickpress make user resources --force
```

**What it generates:**

| Component         | Description                                | Files Created                      |
| ----------------- | ------------------------------------------ | ---------------------------------- |
| **Routes**        | RESTful endpoints with full CRUD           | `routes/entity.routes.ts`          |
| **Controller**    | Request handlers with async error handling | `controllers/entity.controller.ts` |
| **Model**         | Prisma database operations                 | `models/entity.model.ts`           |
| **Types**         | TypeScript interfaces (if TS project)      | `types/entity.d.ts`                |
| **Schema**        | Updates Prisma schema                      | `prisma/schema.prisma`             |
| **HTTP Requests** | Test file for API endpoints                | `requests/entity.http`             |

**What it does automatically:**

- ✅ Prompts for table name (plural form)
- ✅ Prompts for route path
- ✅ Generates all necessary files
- ✅ Auto-injects routes into `src/index.ts`
- ✅ Runs `prisma generate`
- ✅ Runs `prisma db push`

## 📋 Complete Workflow Example

### 1. Create Project

```bash
npx kickpress kick blog-api
```

**Prompts:**

```
✔ What is your project name? · blog-api
✔ Would you like to use TypeScript? · Yes
✔ Which database would you like to use? · sqlite
✔ Which package manager would you like to use? · pnpm

☕ Creating Kickpress project: blog-api

📁 Creating project structure...
📝 Creating project files...
✅ Project created successfully!

📦 Installing dependencies...
✅ Dependencies installed!

📦 Running Prisma generate...
✅ Prisma client generated!

📦 Running Prisma push...
✅ Database initialized!

Next steps:
cd blog-api
pnpm dev
```

> **If using pnpm:** Run `pnpm approve-builds` and select `better-sqlite3` before starting dev server.

### 2. Generate Resources

```bash
cd blog-api
npx kickpress make post resources
```

**Prompts:**

```
✔ What should the table name be? (plural form) · posts
✔ What should the route path be? · /posts

☕ Generating resources for 'post'...

📝 Creating model...
📝 Updating Prisma schema...
📝 Creating types...
📝 Creating controller...
📝 Creating routes...
📝 Updating index file...
📝 Creating HTTP requests...

✅ Resources generated successfully!

📦 Running Prisma generate...
✅ Prisma client updated!

📦 Running Prisma push...
✅ Database updated!
```

### 3. Customize Schema

Edit `prisma/schema.prisma`:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  author    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4. Update Database

```bash
pnpm db:generate
pnpm db:push
```

### 5. Start Development

```bash
pnpm dev
```

### 6. Test Your API

Use the generated `requests/post.http` file or curl:

```bash
# Get all posts
curl http://localhost:3000/posts

# Create a post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","author":"You"}'

# Get one post
curl http://localhost:3000/posts/1

# Update post
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete post
curl -X DELETE http://localhost:3000/posts/1
```

## 📁 Generated Project Structure

```
my-api/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client
│   │   └── generated/              # Prisma generated files
│   ├── controllers/
│   │   └── user.controller.ts      # Request handlers
│   ├── models/
│   │   └── user.model.ts           # Database operations
│   ├── routes/
│   │   └── user.routes.ts          # Express routes
│   ├── types/
│   │   └── user.d.ts               # TypeScript types
│   ├── middlewares/
│   │   └── error.middleware.ts     # Error handling
│   ├── config/                     # Configuration files
│   └── utils/                      # Utility functions
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── requests/
│   └── user.http                   # HTTP test requests
├── public/                         # Static files
├── .env                            # Environment variables
├── .gitignore
├── prisma.config.ts                # Prisma configuration
├── tsconfig.json                   # TypeScript config
├── package.json
└── README.md
```

## 🎨 Generated Code Examples

### Controller

```typescript
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { userFindAll, userFindOne, userCreate } from "../models/user.model";

const all = asyncHandler(async (_: Request, res: Response) => {
  const users = await userFindAll();
  res.json(users);
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userFindOne(Number(id));

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

export { all, findOne };
```

### Routes

```typescript
import { Router } from "express";
import {
  all,
  findOne,
  create,
  update,
  remove,
} from "../controllers/user.controller";

const router = Router();

router.route("/").get(all).post(create);
router.route("/:id").get(findOne).patch(update).delete(remove);

export default router;
```

### Model

```typescript
import prisma from "../lib/prisma";
import type { User, UserCreateInput } from "../types/user";

const userFindAll = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

const userFindOne = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export { userFindAll, userFindOne };
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start dev server with hot reload

# Build (TypeScript only)
pnpm build        # Compile to JavaScript

# Production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio
```

## 🛠️ Technology Stack

### Core

- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe JavaScript (optional)
- **Prisma** - Next-generation ORM

### Development

- **tsx** - TypeScript execution engine
- **express-async-handler** - Async error handling

### Database

- **SQLite** - Default (with better-sqlite3)
- Support for PostgreSQL, MySQL, MongoDB

## 🎯 Key Features Explained

### 1. Automatic Setup

Everything is automated - no manual steps:

- ✅ Dependency installation
- ✅ Prisma client generation
- ✅ Database initialization
- ✅ Schema updates

### 2. Type Safety

Full TypeScript support with generated types:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Error Handling

Comprehensive error middleware:

- ✅ Prisma errors (duplicates, not found)
- ✅ Validation errors
- ✅ Custom errors
- ✅ Stack traces (dev only)

### 4. Smart Pluralization

Solves the plural issue with prompts:

```bash
npx kickpress make city resources
✔ What should the table name be? · cities
```

### 5. Auto-Injection

Routes automatically registered:

```typescript
import cityRoutes from "./routes/city.routes";
app.use("/cities", cityRoutes);
```

### 6. Modern Node.js

Uses native `--env-file` flag:

```json
{
  "scripts": {
    "dev": "tsx watch --env-file=.env src/index.ts"
  }
}
```

## 🧪 Testing Your API

### Using HTTP Files

1. Install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) in VS Code
2. Open `requests/user.http`
3. Click "Send Request"

### Using curl

See examples in [Complete Workflow](#6-test-your-api)

## 🐛 Troubleshooting

### pnpm: "Cannot find module" errors

```bash
pnpm approve-builds
# Select: better-sqlite3
```

### Prisma Client errors

```bash
pnpm db:generate
```

### Port already in use

Change port in `.env`:

```env
PORT=3001
```

## 📝 Configuration

### Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
```

### Prisma Configuration

```typescript
// prisma.config.ts
import "dotenv/config";
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
```

## ❓ FAQ

**Q: Can I use this in production?**
A: Yes! The generated code is production-ready. Add authentication, CORS, and logging as needed.

**Q: What databases are supported?**
A: SQLite (default), PostgreSQL, MySQL, MongoDB.

**Q: Can I customize generated code?**
A: Absolutely! All code is yours to modify.

**Q: How is this different from NestJS?**
A: NestJS is a framework. Kickpress is a scaffolding tool that generates Express.js code.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## 👤 Author

**Marc Tyson CLEBERT**

- Website: [marctysonclebert.com](https://www.marctysonclebert.com)
- GitHub: [@clebertmarctyson](https://github.com/clebertmarctyson)
- Twitter: [@ClebertTyson](https://x.com/ClebertTyson)
- Email: [contact@marctysonclebert.com](mailto:contact@marctysonclebert.com)

## 📄 License

MIT © [Marc Tyson CLEBERT](https://www.marctysonclebert.com)

## 💬 Support

- 🐛 [Report Issues](https://github.com/clebertmarctyson/kickpress/issues)
- 💡 [Request Features](https://github.com/clebertmarctyson/kickpress/issues/new)
- 📧 Email: [contact@marctysonclebert.com](mailto:contact@marctysonclebert.com)
- ⭐ [Star on GitHub](https://github.com/clebertmarctyson/kickpress)
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/marctysonclebert)

---

Made with ☕ and ❤️ by [Marc Tyson CLEBERT](https://www.marctysonclebert.com)
