# ☕ Kickpress CLI

> A fast and opinionated CLI for scaffolding Express.js projects with TypeScript, Prisma, and security-first best practices built-in.

Kickpress helps you create production-ready Express.js APIs in seconds, with full CRUD generation, input validation, type safety, and modern tooling.

[![npm version](https://img.shields.io/npm/v/kickpress.svg)](https://www.npmjs.com/package/kickpress)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [✨ Features](#-features)
- [⚡ Why Kickpress?](#-why-kickpress)
- [📋 Requirements](#-requirements)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🎨 Templates](#-templates)
- [📖 Command Reference](#-command-reference)
  - [`init` - Create a New Project](#init---create-a-new-project)
  - [`make` - Generate Resources](#make---generate-resources)
  - [`add db` - Add Database to Existing Project](#add-db---add-database-to-existing-project)
- [📋 Complete Workflow Example](#-complete-workflow-example)
- [📁 Generated Project Structure](#-generated-project-structure)
- [🎨 Generated Code Examples](#-generated-code-examples)
- [🔒 Security & Validation](#-security--validation)
- [🔧 Available Scripts](#-available-scripts)
- [🛠️ Technology Stack](#️-technology-stack)
- [🗄️ Database Support](#️-database-support)
- [🧪 Testing Your API](#-testing-your-api)
- [🐛 Troubleshooting](#-troubleshooting)
- [❓ FAQ](#-faq)
- [🤝 Contributing](#-contributing)
- [👤 Author](#-author)
- [📄 License](#-license)
- [💬 Support](#-support)

## ✨ Features

- 🚀 **Instant Setup** - Create a complete project in seconds with auto-installation
- 🎨 **Multiple Templates** - REST API, NPM package, CLI tool, or static Web app
- 🔒 **Security First** - Built-in input validation with Zod on all endpoints
- 📦 **TypeScript First** - Full TypeScript support with proper types (JavaScript optional)
- 🗄️ **Optional Database** - SQLite or PostgreSQL via Prisma — or no database at all
- 🎯 **CRUD Generation** - Generate the full stack for any entity in one command
- 🔄 **Auto-injection** - Routes automatically added to your app
- ➕ **Add Database Later** - Add Prisma to any existing project with `kickpress add db`
- ⚡ **Modern Stack** - Express, Prisma, Zod, tsx, and express-async-handler
- 🛡️ **Error Handling** - Comprehensive error middleware included
- 📝 **HTTP Requests** - Test files generated for each resource
- ⚙️ **Zero Configuration** - Everything works out of the box

## ⚡ Why Kickpress?

| Task                 | Manual Setup       | With Kickpress  |
| -------------------- | ------------------ | --------------- |
| Project Setup        | 15-30 minutes      | 30 seconds      |
| Prisma Configuration | Manual config      | Auto-configured |
| Input Validation     | Write from scratch | Auto-generated  |
| CRUD Generation      | Write from scratch | 1 command       |
| Error Handling       | Custom impl        | Built-in        |
| Type Safety          | Manual types       | Auto-generated  |
| Route Registration   | Manual import      | Auto-injected   |
| Add DB Later         | Manual wiring      | 1 command       |

## 📋 Requirements

- **Node.js**: v20.0.0 or higher (for `--env-file` support)
- **Package Manager**: npm, pnpm, or yarn
- **Operating System**: macOS, Linux, or Windows
- **PostgreSQL**: Required only if using the PostgreSQL database option

> **Note**: Kickpress uses Node.js native `--env-file` flag. For Node.js < v20, you may need additional configuration.

## 🚀 Quick Start

```bash
# Interactive (recommended for first-time users)
npx kickpress init

# One-liner with all defaults (TypeScript, API template, SQLite, pnpm)
npx kickpress init my-api -y

# Navigate and start
cd my-api
pnpm dev
```

Your API is now running at `http://localhost:3000`! 🎉

## 📦 Installation

No installation required — use `npx` to run directly:

```bash
npx kickpress init my-project
```

Or install globally:

```bash
npm install -g kickpress
kickpress init my-project
```

## 🎨 Templates

Choose a template with `-t`:

| Template | Description                                          | Database |
| -------- | ---------------------------------------------------- | -------- |
| `api`    | REST API with Express, Prisma, Zod, and CRUD helpers | Optional |
| `npm`    | Publishable NPM package with TypeScript declarations | None     |
| `cli`    | Command-line tool with Commander.js                  | None     |
| `web`    | Static HTML/CSS/JS web app with Express              | Optional |

```bash
npx kickpress init my-api  -t api
npx kickpress init my-lib  -t npm
npx kickpress init my-tool -t cli
npx kickpress init my-site -t web
```

## 📖 Command Reference

### `init` - Create a New Project

Creates a complete project with all dependencies and folder structure.

**Syntax:**

```bash
kickpress init [project-name] [options]
```

**Alias:** `in`

**Arguments:**

- `project-name` — Name of your project (optional, will prompt if not provided)

**Options:**

| Flag                           | Description                                             |
| ------------------------------ | ------------------------------------------------------- |
| `-t, --template <template>`    | Template: `api` \| `npm` \| `cli` \| `web`             |
| `-d, --database <database>`    | Database: `sqlite` \| `postgresql` \| `none`           |
| `--typescript`                 | Use TypeScript                                          |
| `--no-typescript`              | Use JavaScript instead                                  |
| `-p, --package-manager <pm>`   | Package manager: `pnpm` \| `npm` \| `yarn`            |
| `-y, --yes`                    | Accept all defaults (TypeScript, api, sqlite, pnpm)    |

**Examples:**

```bash
# Interactive (prompts for everything)
npx kickpress init

# Accept all defaults — no prompts
npx kickpress init my-api -y
npx kickpress in my-api -y

# API with SQLite
npx kickpress init my-api -t api -d sqlite

# API with PostgreSQL
npx kickpress init my-api -t api -d postgresql

# API with no database
npx kickpress init my-api -t api -d none

# NPM package (no database)
npx kickpress init my-lib -t npm

# CLI tool (no database)
npx kickpress init my-tool -t cli

# JavaScript project
npx kickpress init my-api --no-typescript -t api -d sqlite
```

**What it does automatically:**

- ✅ Creates complete folder structure
- ✅ Generates all configuration files
- ✅ Installs all dependencies
- ✅ Generates Prisma Client and pushes schema (when database is selected)
- ✅ Sets up error handling middleware
- ✅ Configures TypeScript/JavaScript

---

### `make` - Generate Resources

Generates the full CRUD stack for any entity — model, service, controller, validation, routes, and HTTP test file — all wired together and injected into `src/index.*`.

**Syntax:**

```bash
kickpress make <entity> [options]
```

**Alias:** `mk`

**Arguments:**

- `entity` — Name of the entity (singular, e.g., `user`, `post`, `product`)

**Options:**

| Flag              | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `--table <name>`  | Table name (plural), skips interactive prompt         |
| `--route <path>`  | Route path (e.g. `/todos`), skips prompt              |
| `-f, --force`     | Overwrite existing files                              |

**Examples:**

```bash
# Interactive (prompts for table name and route path)
npx kickpress make user
npx kickpress make post

# Non-interactive (useful in scripts/CI)
npx kickpress make todo --table todos --route /todos
npx kickpress mk   post --table posts --route /posts
```

**What it generates:**

| File                              | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `prisma/schema.prisma`            | Updated with new model stub                     |
| `types/entity.d.ts`               | TypeScript interfaces (TS only)                 |
| `models/entity.model.*`           | Raw Prisma database operations                  |
| `services/entity.service.*`       | Business logic wrapping the model               |
| `controllers/entity.controller.*` | HTTP handlers calling the service               |
| `validations/entity.validation.*` | Zod schemas and validation middleware           |
| `routes/entity.routes.*`          | Express routes wired to controller + validation |
| `requests/entity.http`            | HTTP test file for all endpoints                |

Routes are also **auto-injected** into `src/index.*`.

**Architecture flow:**

```
Request → Routes → Validation → Controller → Service → Model → Prisma → DB
```

Each layer has a single responsibility — you add business logic in the service, database queries in the model, and HTTP concerns in the controller.

---

### `add db` - Add Database to Existing Project

Wires Prisma into a project that was initially created without a database. All files are patched automatically — you just add your models to `prisma/schema.prisma`.

**Syntax:**

```bash
kickpress add db [database]
```

**Arguments:**

- `database` — `sqlite` or `postgresql` (optional, will prompt if not provided)

**Examples:**

```bash
# Interactive prompt
npx kickpress add db

# Non-interactive
npx kickpress add db sqlite
npx kickpress add db postgresql
```

**What it does:**

- ✅ Installs `@prisma/client`, `prisma`, and the correct database adapter
- ✅ Creates `prisma/schema.prisma` and `prisma.config.ts`
- ✅ Creates `src/lib/prisma.ts` (typed Prisma client)
- ✅ Patches `error.middleware.*` to handle Prisma error codes (`P2002`, `P2025`)
- ✅ Appends `DATABASE_URL` to `.env`
- ✅ Appends Prisma entries to `.gitignore`
- ✅ Adds `db:generate`, `db:push`, `db:migrate`, `db:studio` scripts to `package.json`
- ✅ Runs `db:generate` and `db:push` automatically

> **Note:** This command is safe to run on any Kickpress Express project regardless of template. It will exit early if a database is already configured.

## 📋 Complete Workflow Example

### REST API with SQLite

**1. Create project:**

```bash
npx kickpress init blog-api -t api -d sqlite
cd blog-api
```

> **pnpm users:** Run `pnpm approve-builds` and select `better-sqlite3` before starting.

**2. Generate resources:**

```bash
npx kickpress make post
# Prompts: table name (e.g. posts), route path (e.g. /posts)
```

**3. Add fields to your model and validation:**

Edit `prisma/schema.prisma` (generated stub already has `id`, `createdAt`, `updatedAt`):

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  author    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Edit `src/validations/post.validation.ts` to mirror your fields:

```typescript
const postCreateSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  author: z.string().min(1).max(100),
});
```

Edit `src/types/post.d.ts` to add the same fields:

```typescript
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**4. Push schema and start:**

```bash
pnpm db:generate
pnpm db:push
pnpm dev
```

**5. Test your API:**

```bash
# Get all posts
curl http://localhost:3000/posts

# Create a post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","author":"You"}'
```

### REST API with PostgreSQL

```bash
npx kickpress init blog-api -t api -d postgresql
cd blog-api
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/blogdb?schema=public"
```

```bash
pnpm db:generate
pnpm db:push
pnpm dev
```

### Adding a Database Later

```bash
npx kickpress init blog-api -t api -d none
cd blog-api
# ... develop, change your mind ...
npx kickpress add db sqlite
```

## 📁 Generated Project Structure

### API template (with database)

```
my-api/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── lib/
│   │   └── prisma.ts               # Prisma client
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── routes/
│   │   └── user.routes.ts
│   ├── validations/
│   │   └── user.validation.ts
│   ├── types/
│   │   └── user.d.ts
│   ├── middlewares/
│   │   └── error.middleware.ts
│   ├── config/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── requests/
│   └── user.http
├── .env
├── tsconfig.json
└── package.json
```

## 🎨 Generated Code Examples

### Model (`src/models/user.model.ts`)

Raw database operations using Prisma. Only the model touches the database directly.

```typescript
import prisma from "../lib/prisma";
import type { User, UserCreateInput, UserUpdateInput } from "../types/user";

const userFindAll = async (): Promise<User[]> => {
  return prisma.user.findMany();
};

const userFindOne = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

const userCreate = async (data: UserCreateInput): Promise<User> => {
  return prisma.user.create({ data });
};

const userUpdate = async (id: number, data: UserUpdateInput): Promise<User | null> => {
  return prisma.user.update({ where: { id }, data });
};

const userDelete = async (id: number): Promise<User | null> => {
  return prisma.user.delete({ where: { id } });
};

export { userFindAll, userFindOne, userCreate, userUpdate, userDelete };
```

### Service (`src/services/user.service.ts`)

Business logic layer. Controllers call the service — never the model directly. Add your business rules here (e.g. hashing passwords, sending emails, enforcing limits).

```typescript
import { userFindAll, userFindOne, userCreate, userUpdate, userDelete } from "../models/user.model";
import type { User, UserCreateInput, UserUpdateInput } from "../types/user";

export const getAllUsers = async (): Promise<User[]> => {
  return userFindAll();
};

export const getUser = async (id: number): Promise<User | null> => {
  return userFindOne(id);
};

export const createUser = async (data: UserCreateInput): Promise<User> => {
  return userCreate(data);
};

export const updateUser = async (id: number, data: UserUpdateInput): Promise<User | null> => {
  return userUpdate(id, data);
};

export const deleteUser = async (id: number): Promise<User | null> => {
  return userDelete(id);
};
```

### Controller (`src/controllers/user.controller.ts`)

HTTP layer. Calls the service, handles 404s, sends responses.

```typescript
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../services/user.service";

const all = asyncHandler(async (_: Request, res: Response) => {
  const users = await getAllUsers();
  res.json(users);
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUser(Number(req.params.id));
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json(user);
});

const create = asyncHandler(async (req: Request, res: Response) => {
  const user = await createUser(req.body); // body already validated by middleware
  res.status(201).json(user);
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUser(Number(req.params.id));
  if (!user) { res.status(404); throw new Error("User not found"); }
  const updated = await updateUser(user.id, req.body);
  res.json(updated);
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUser(Number(req.params.id));
  if (!user) { res.status(404); throw new Error("User not found"); }
  await deleteUser(user.id);
  res.status(204).send();
});

export { all, findOne, create, update, remove };
```

### Routes (`src/routes/user.routes.ts`)

Wires validation middleware to controller handlers.

```typescript
import { Router } from "express";
import { all, findOne, create, update, remove } from "../controllers/user.controller";
import { validateUserCreate, validateUserUpdate, validateUserId } from "../validations/user.validation";

const router = Router();

router.route("/")
  .get(all)
  .post(validateUserCreate, create);

router.route("/:id")
  .get(validateUserId, findOne)
  .patch(validateUserId, validateUserUpdate, update)
  .delete(validateUserId, remove);

export default router;
```

### Validation (`src/validations/user.validation.ts`)

Generated with empty schemas and a robust ID validator. Add your fields after extending the Prisma model.

```typescript
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const userCreateSchema = z.object({
  // Add your fields here after extending the Prisma model
});

const userUpdateSchema = z.object({
  // Add your fields here (make them optional)
});

const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a positive integer").transform(Number),
});

// Validation middleware is auto-generated — just fill in the schemas above
export const validateUserCreate = /* ... */;
export const validateUserUpdate = /* ... */;
export const validateUserId = /* ... */;
```

**Example after adding fields:**

```typescript
const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().toLowerCase().trim(),
  age: z.number().int().positive().optional(),
});
```

## 🔒 Security & Validation

### Built-in Protection

✅ **SQL Injection Protection** — Prisma uses parameterized queries
✅ **Input Validation** — Zod validates all request data
✅ **Type Coercion** — Safe type transformation
✅ **Error Information Leakage** — Safe error messages in production

### Customizing Validation

After adding fields to your Prisma model, mirror them in `src/validations/user.validation.ts`:

```typescript
const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().toLowerCase().trim(),
  age: z.number().int().positive().min(18).max(120).optional(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().toLowerCase().trim().optional(),
  age: z.number().int().positive().min(18).max(120).optional(),
});
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start dev server with hot reload

# Build (TypeScript only)
pnpm build        # Compile to JavaScript

# Production
pnpm start        # Start production server

# Database (when database is configured)
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Create migration
pnpm db:studio    # Open Prisma Studio
```

## 🛠️ Technology Stack

### Core

- **Express.js** — Fast, minimalist web framework
- **TypeScript** — Type-safe JavaScript (optional)
- **Zod** — TypeScript-first schema validation

### Development

- **tsx** — TypeScript execution engine
- **express-async-handler** — Async error handling

### Database (optional)

- **Prisma** — Next-generation ORM
- **SQLite** — File-based, zero config (with better-sqlite3 adapter)
- **PostgreSQL** — Production-ready (with @prisma/adapter-pg)

## 🗄️ Database Support

Database is **optional** for `api` and `web` templates and **not available** for `npm` and `cli` templates. You can also add it at any time with `kickpress add db`.

### SQLite

Best for local development and prototyping. Zero configuration — Kickpress sets it up automatically.

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL

Best for production. Requires a running PostgreSQL server and manual `DATABASE_URL` configuration.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Popular hosted options:

```env
# Neon
DATABASE_URL="postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres:pass@db.project.supabase.co:5432/postgres?schema=public"

# Railway
DATABASE_URL="postgresql://postgres:pass@containers-us-west.railway.app:5432/railway?schema=public"
```

### No Database

Use `-d none` to skip Prisma entirely. The generated project has no Prisma dependencies.

```bash
npx kickpress init my-api -t api -d none
```

You can always add it later:

```bash
npx kickpress add db sqlite
```

## 🧪 Testing Your API

Each generated resource includes an `.http` file. Use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in VS Code:

1. Open `requests/user.http`
2. Click "Send Request" above any request

Or use curl:

```bash
curl http://localhost:3000/users
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

## 🐛 Troubleshooting

### pnpm: "Cannot find module" errors (SQLite)

```bash
pnpm approve-builds
# Select: better-sqlite3 (press space, then enter)
```

This is a one-time setup required by pnpm for native dependencies.

### Prisma Client errors

```bash
pnpm db:generate
```

### Port already in use

Change port in `.env`:

```env
PORT=3001
```

### PostgreSQL connection errors

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql "postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Common causes: wrong credentials, database doesn't exist, port blocked, SSL required (`?sslmode=require`).

## ❓ FAQ

**Q: Can I use this in production?**
A: Yes! The generated code is production-ready. Use PostgreSQL for production and add authentication, CORS, and rate limiting as needed.

**Q: What databases are supported?**
A: SQLite and PostgreSQL. MySQL and MongoDB support planned.

**Q: Can I add a database to a project that was created without one?**
A: Yes! Run `npx kickpress add db [sqlite|postgresql]` from inside your project. It wires up everything automatically.

**Q: Can I switch from SQLite to PostgreSQL later?**
A: Yes! Update the `provider` in `schema.prisma` and `DATABASE_URL` in `.env`, then re-run migrations.

**Q: What if I don't need a database?**
A: Use `-d none`. The project will have no Prisma dependencies at all, and you can add one later with `kickpress add db`.

**Q: How is this different from NestJS?**
A: NestJS is a framework. Kickpress is a scaffolding tool that generates plain Express.js code.

**Q: Can I customize the generated code?**
A: Absolutely — it's all yours to modify. The CLI just generates a well-structured starting point.

**Q: Can I disable validation on specific endpoints?**
A: Yes, remove the validation middleware from the route definition.

## 🤝 Contributing

Contributions are welcome!

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
