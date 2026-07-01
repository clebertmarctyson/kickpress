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
- [🎨 Templates & Starters](#-templates--starters)
- [📖 Command Reference](#-command-reference)
  - [`init` - Create a New Project](#init---create-a-new-project)
  - [`make` - Generate Resources](#make---generate-resources)
  - [`add db` - Add Database to Existing Project](#add-db---add-database-to-existing-project)
  - [`switch db` - Switch Database Provider](#switch-db---switch-database-provider)
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
- ⚡ **Starter Content** - Blank or pre-built starter (Todo API, Math library, Math CLI)
- 🔒 **Security First** - Built-in input validation with Zod on all endpoints
- 📦 **TypeScript First** - Full TypeScript support with proper types (JavaScript optional)
- 🗄️ **Optional Database** - SQLite, PostgreSQL, MySQL, or MongoDB via Prisma — available for API, Web, and CLI templates
- 🎯 **CRUD Generation** - Generate the full stack for any entity in one command
- 🔄 **Auto-injection** - Routes automatically added to your app
- ➕ **Add Database Later** - Add Prisma to any existing project with `kickpress add db`
- 🔀 **Switch Database** - Switch between SQLite, PostgreSQL, and MySQL with `kickpress switch db`
- ⚡ **Modern Stack** - Express, Prisma, Zod, tsx, and express-async-handler
- 🛡️ **Error Handling** - Comprehensive error middleware included
- 📝 **HTTP Requests** - Test files generated for each resource
- ⚙️ **Zero Configuration** - Everything works out of the box

## ⚡ Why Kickpress?

| Task                   | Manual Setup       | With Kickpress  |
| ---------------------- | ------------------ | --------------- |
| Project Setup          | 15-30 minutes      | 30 seconds      |
| Prisma Configuration   | Manual config      | Auto-configured |
| Input Validation       | Write from scratch | Auto-generated  |
| CRUD Generation        | Write from scratch | 1 command       |
| Error Handling         | Custom impl        | Built-in        |
| Type Safety            | Manual types       | Auto-generated  |
| Route Registration     | Manual import      | Auto-injected   |
| Add DB Later           | Manual wiring      | 1 command       |
| Switch DB Provider     | Manual refactor    | 1 command       |

## 📋 Requirements

- **Node.js**: v20.0.0 or higher (for `--env-file` support)
- **Package Manager**: npm, pnpm, or yarn
- **Operating System**: macOS, Linux, or Windows
- **PostgreSQL / MySQL**: Required only if using those database options
- **MongoDB**: Required only if using the MongoDB option — must run as a replica set (see [MongoDB setup](#mongodb))

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

## 🎨 Templates & Starters

Choose a template with `-t`. When running interactively (without `-y`), you will also be asked to pick a **starter** — a pre-built starting point for that template.

### Templates

| Template | Description                                          | Database |
| -------- | ---------------------------------------------------- | -------- |
| `api`    | REST API with Express, Prisma, Zod, and CRUD helpers | Optional |
| `npm`    | Publishable NPM package with TypeScript declarations | None     |
| `cli`    | Command-line tool with Commander.js                  | Optional |
| `web`    | Static HTML/CSS/JS web app with Express              | Optional |

```bash
npx kickpress init my-api  -t api
npx kickpress init my-lib  -t npm
npx kickpress init my-tool -t cli
npx kickpress init my-site -t web
```

### Starters

When you run `kickpress init` interactively, you'll be asked which starter to use:

| Template | Blank | Starter |
| -------- | ----- | ------- |
| `api`    | Empty project — add resources with `kickpress make` | **Todo** — complete CRUD API with `title`, `completed` fields, ready to run |
| `web`    | Empty project | **Todo** — Todo API + working HTML/CSS/JS frontend |
| `npm`    | `hello()` export | **Math library** — `sum`, `subtract`, `multiply`, `divide` with error handling |
| `cli`    | `hello` command | **Math CLI** — `add 2 4 → 8`, `subtract`, `multiply`, `divide` commands |

> **Note**: The Todo starter defaults to SQLite — no connection string needed. Pass `--database mongodb` to use MongoDB instead. The `-y` flag always uses blank.

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
| `-d, --database <database>`    | Database: `sqlite` \| `postgresql` \| `mysql` \| `mongodb` \| `none` |
| `--typescript`                 | Use TypeScript                                          |
| `--no-typescript`              | Use JavaScript instead                                  |
| `-p, --package-manager <pm>`   | Package manager: `pnpm` \| `npm` \| `yarn`            |
| `-y, --yes`                    | Accept all defaults (TypeScript, api, sqlite, pnpm, blank starter) |

**Examples:**

```bash
# Interactive (prompts for template, starter, TypeScript, database, package manager)
npx kickpress init
npx kickpress init my-api

# Accept all defaults — no prompts, blank starter
npx kickpress init my-api -y
npx kickpress in  my-api -y

# API with SQLite
npx kickpress init my-api -t api -d sqlite

# API with PostgreSQL (db:push shown as next step — run after setting DATABASE_URL)
npx kickpress init my-api -t api -d postgresql

# API with MySQL (db:push shown as next step — run after setting DATABASE_URL)
npx kickpress init my-api -t api -d mysql

# API with MongoDB (db:push runs automatically — requires a running replica set)
npx kickpress init my-api -t api -d mongodb

# API with no database
npx kickpress init my-api -t api -d none

# CLI tool with SQLite database
npx kickpress init my-tool -t cli -d sqlite

# NPM package (no database)
npx kickpress init my-lib -t npm

# JavaScript project
npx kickpress init my-api --no-typescript -t api -d sqlite
```

**What it does automatically:**

- ✅ Creates complete folder structure
- ✅ Generates all configuration files
- ✅ Installs all dependencies
- ✅ Applies selected starter content
- ✅ Generates Prisma Client and pushes schema (SQLite and MongoDB run automatically — PostgreSQL/MySQL show next steps)
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
| `--route <path>`  | Route path (e.g. `/todos`), skips prompt              |

`tableName` (used for the list variable in the controller, e.g. `const people = ...`) is always derived from the route — the last path segment, `kebab-case` converted to `camelCase`. No separate table-name flag or prompt.

**Examples:**

```bash
# Interactive (prompts for the route path only)
npx kickpress make user
npx kickpress make post

# Non-interactive (useful in scripts/CI)
npx kickpress make todo --route /todos
npx kickpress mk   post --route /posts

# Irregular plurals just work — table name comes from whatever you type here
npx kickpress make person --route /people
```

**What it generates:**

| File                                       | Description                                     |
| ------------------------------------------- | ----------------------------------------------- |
| `prisma/schema.prisma`                     | Updated with new model stub                     |
| `modules/entity/entity.types.ts`           | TypeScript interfaces (TS only)                 |
| `modules/entity/entity.model.*`            | Raw Prisma database operations (constructor-injected client) |
| `modules/entity/entity.service.*`          | Business logic wrapping the model               |
| `modules/entity/entity.controller.*`       | HTTP handlers (class, constructor DI)           |
| `modules/entity/entity.validation.*`       | Zod schemas and validation middleware           |
| `modules/entity/entity.routes.*`           | Wires model → service → controller, owns router |
| `requests/entity.http`                     | HTTP test file for all endpoints                |

Requires a database to already be configured (`kickpress add db ...` or select one during `init`) — `make` exits early with an error otherwise. Generated code is formatted with Prettier before being written.

Routes are also **auto-injected** into `src/routes/index.*`.

**Architecture flow:**

```
Request → Routes → Validation → Controller → Service → Model → Prisma → DB
```

---

### `add db` - Add Database to Existing Project

Wires Prisma into a project that was initially created without a database. Works for **API, Web, and CLI** projects.

**Syntax:**

```bash
kickpress add db [database]
```

**Arguments:**

- `database` — `sqlite`, `postgresql`, `mysql`, or `mongodb` (optional, will prompt if not provided)

**Examples:**

```bash
# Interactive prompt
npx kickpress add db

# Non-interactive
npx kickpress add db sqlite
npx kickpress add db postgresql
npx kickpress add db mysql
npx kickpress add db mongodb
```

**What it does:**

- ✅ Installs `@prisma/client`, `prisma`, and the correct database adapter
- ✅ Creates `prisma/schema.prisma` and `prisma.config.ts`
- ✅ Creates `src/lib/prisma.ts` (typed Prisma client)
- ✅ Patches `error.middleware.*` to handle Prisma error codes (`P2002`, `P2025`) — API/Web only
- ✅ Appends `DATABASE_URL` to `.env`
- ✅ Appends Prisma entries to `.gitignore`
- ✅ Adds `db:generate` and `db:push` scripts to `package.json`
- ✅ Adds `db:migrate` and `db:studio` scripts (SQLite, PostgreSQL, and MySQL only — not MongoDB)
- ✅ Runs `db:generate` and `db:push` automatically (SQLite and MongoDB)
- ✅ For PostgreSQL/MySQL: runs `db:generate`, then shows next steps to set `DATABASE_URL` and run `db:push`

> **Note:** This command is safe to run on any Kickpress project (API, Web, or CLI). It will exit early if a database is already configured.

---

### `switch db` - Switch Database Provider

Switches your project between SQLite, PostgreSQL, and MySQL. Updates all configuration — packages, schema provider, `.env`, and the Prisma client file — without touching your schema models.

> ⚠️ **MongoDB cannot be switched to or from.** MongoDB uses Prisma v6, while SQLite/PostgreSQL/MySQL use Prisma v7. These are incompatible. Create a new project instead.

**Syntax:**

```bash
kickpress switch db [database]
```

**Arguments:**

- `database` — `sqlite`, `postgresql`, or `mysql` (optional, will prompt if not provided)

**Examples:**

```bash
# Interactive prompt (shows current provider, lets you pick the target)
npx kickpress switch db

# Non-interactive
npx kickpress switch db postgresql
npx kickpress switch db mysql
npx kickpress switch db sqlite
```

**What it does:**

- ✅ Uninstalls the current database adapter
- ✅ Installs the new database adapter
- ✅ Updates `provider` in `prisma/schema.prisma`
- ✅ Updates `DATABASE_URL` in `.env`
- ✅ Regenerates `src/lib/prisma.*` with the correct adapter
- ✅ Runs `db:generate`
- ✅ Runs `db:push` automatically when switching **to SQLite**
- ✅ Shows next steps when switching **to PostgreSQL or MySQL** (requires a live connection first)

> ⚠️ **Data migration is manual.** `switch db` only switches the schema and configuration. Your existing data is not transferred. Back up your data before switching.

**Next steps after switching to PostgreSQL:**

```bash
# 1. Update your connection string in .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# 2. Push the schema to your PostgreSQL database
pnpm db:push

# 3. Migrate your data manually
```

**Next steps after switching to MySQL:**

```bash
# 1. Update your connection string in .env
DATABASE_URL="mysql://user:password@localhost:3306/database"

# 2. Push the schema to your MySQL database
pnpm db:push

# 3. Migrate your data manually
```

## 📋 Complete Workflow Example

### REST API with SQLite (Todo Starter)

**1. Create project interactively:**

```bash
npx kickpress init my-api
# Select: REST API → Todo starter → TypeScript → SQLite → pnpm
cd my-api
pnpm dev
```

> The Todo starter generates a complete, working `/todos` CRUD API — ready to run with no edits.

**2. Test immediately:**

```bash
curl http://localhost:3000/todos
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy coffee"}'
```

---

### REST API with SQLite (Blank)

**1. Create project:**

```bash
npx kickpress init blog-api -t api -d sqlite
cd blog-api
```

**2. Generate resources:**

```bash
npx kickpress make post
# Prompts: route path (e.g. /posts) — table name (posts) is derived from it
```

**3. Add fields to your model and validation:**

Edit `prisma/schema.prisma`:

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

Edit `src/modules/post/post.validation.ts`:

```typescript
const postCreateSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  author: z.string().min(1).max(100),
});
```

**4. Push schema and start:**

```bash
pnpm db:generate
pnpm db:push
pnpm dev
```

---

### REST API with PostgreSQL

```bash
npx kickpress init blog-api -t api -d postgresql
cd blog-api
```

Update `.env`:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/blogdb?schema=public"
```

```bash
pnpm db:push
pnpm dev
```

---

### REST API with MongoDB

```bash
npx kickpress init blog-api -t api -d mongodb
cd blog-api
```

Update `.env` with your connection string (must point to a replica set):

```env
# Local replica set
DATABASE_URL="mongodb://127.0.0.1:27017/blog-api?replicaSet=rs0&directConnection=true"

# MongoDB Atlas
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/blog-api?retryWrites=true&w=majority"
```

```bash
pnpm db:push
pnpm dev
```

> **Note:** MongoDB requires a running replica set. For local development, start `mongod --replSet rs0` and run `rs.initiate()` once in `mongosh`. For production, use [MongoDB Atlas](https://www.mongodb.com/atlas).

---

### CLI Tool with Database

```bash
# Create with database from the start
npx kickpress init my-tool -t cli -d sqlite
cd my-tool
pnpm dev

# Or add a database to an existing CLI project
npx kickpress add db sqlite
```

---

### Adding a Database Later

```bash
npx kickpress init blog-api -t api -d none
cd blog-api
# ... develop, change your mind ...
npx kickpress add db sqlite
```

---

### Switching Database Provider

```bash
# Switch from SQLite to PostgreSQL
npx kickpress switch db postgresql
# → Update DATABASE_URL in .env, then run: pnpm db:push

# Switch from SQLite to MySQL
npx kickpress switch db mysql
# → Update DATABASE_URL in .env, then run: pnpm db:push

# Switch back to SQLite
npx kickpress switch db sqlite
# → db:push runs automatically
```

> MongoDB cannot be switched to or from (different Prisma major version). Create a new project instead.

## 📁 Generated Project Structure

### API template (with database)

```
my-api/
├── src/
│   ├── index.ts                    # App entry (sealed — never touched by make)
│   ├── routes/
│   │   └── index.ts               # Route barrel (auto-updated by make)
│   ├── lib/
│   │   └── prisma.ts              # Prisma client
│   ├── middlewares/
│   │   └── error.middleware.ts
│   └── utils/
├── prisma/
│   └── schema.prisma
├── requests/
├── .env
├── tsconfig.json
└── package.json
```

After `kickpress make user`, each entity gets its own folder under `src/modules/`:

```
src/
└── modules/
    └── user/
        ├── user.model.ts              # Prisma operations
        ├── user.service.ts            # Business logic
        ├── user.controller.ts         # HTTP handlers
        ├── user.routes.ts             # Wires graph + owns the router
        ├── user.types.ts              # TypeScript interfaces
        └── user.validation.ts         # Zod schemas + middleware
```

## 🎨 Generated Code Examples

### Model (`src/modules/user/user.model.ts`)

```typescript
import type PrismaClientInstance from "@/lib/prisma";
import type { User, UserCreateInput, UserUpdateInput } from "./user.types";

export class UserModel {
  constructor(private prisma: typeof PrismaClientInstance) {}

  async findAll(): Promise<User[]> { return this.prisma.user.findMany(); }
  async findOne(id: number): Promise<User | null> { return this.prisma.user.findUnique({ where: { id } }); }
  async create(data: UserCreateInput): Promise<User> { return this.prisma.user.create({ data }); }
  async update(id: number, data: UserUpdateInput): Promise<User | null> { return this.prisma.user.update({ where: { id }, data }); }
  async delete(id: number): Promise<User | null> { return this.prisma.user.delete({ where: { id } }); }
}
```

### Controller (`src/modules/user/user.controller.ts`)

```typescript
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserService } from "./user.service";

export class UserController {
  constructor(private service: UserService) {}

  all = asyncHandler(async (_: Request, res: Response) => {
    res.json(await this.service.getAll());
  });
  findOne = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.service.getOne(Number(req.params.id));
    if (!user) { res.status(404); throw new Error("User not found"); }
    res.json(user);
  });
  create = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await this.service.create(req.body));
  });
  update = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.service.getOne(Number(req.params.id));
    if (!user) { res.status(404); throw new Error("User not found"); }
    res.json(await this.service.update(user.id, req.body));
  });
  remove = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.service.getOne(Number(req.params.id));
    if (!user) { res.status(404); throw new Error("User not found"); }
    await this.service.delete(user.id);
    res.status(204).send();
  });
}
```

### Routes (`src/modules/user/user.routes.ts`)

```typescript
import { Router } from "express";
import prisma from "@/lib/prisma";
import { UserModel } from "./user.model";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { validateUserCreate, validateUserUpdate, validateUserId } from "./user.validation";

const model = new UserModel(prisma);
const service = new UserService(model);
const controller = new UserController(service);

const router = Router();
router.route("/").get(controller.all).post(validateUserCreate, controller.create);
router.route("/:id")
  .get(validateUserId, controller.findOne)
  .patch(validateUserId, validateUserUpdate, controller.update)
  .delete(validateUserId, controller.remove);

export default router;
```

### Validation (`src/modules/user/user.validation.ts`)

Standard (fill in your fields after extending the Prisma model):

```typescript
const userCreateSchema = z.object({
  // Add your fields here after extending the Prisma model
});
```

Todo Starter (pre-filled and ready to use):

```typescript
const todoCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  completed: z.boolean().optional().default(false),
});

const todoUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});
```

## 🔒 Security & Validation

✅ **SQL Injection Protection** — Prisma uses parameterized queries
✅ **Input Validation** — Zod validates all request data
✅ **Type Coercion** — Safe type transformation
✅ **Error Information Leakage** — Safe error messages in production

## 🔧 Available Scripts

```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Compile TypeScript to JavaScript
pnpm start        # Start production server

# Database (when configured)
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Create migration (SQLite, PostgreSQL, MySQL only)
pnpm db:studio    # Open Prisma Studio (SQLite, PostgreSQL, MySQL only)
```

> `db:migrate` and `db:studio` are not added for MongoDB projects (Prisma Studio does not support MongoDB).

## 🛠️ Technology Stack

- **Express.js** — Fast, minimalist web framework
- **TypeScript** — Type-safe JavaScript (optional)
- **Zod** — TypeScript-first schema validation
- **Commander.js** — CLI argument parsing (CLI template)
- **tsx** — TypeScript execution engine
- **express-async-handler** — Async error handling
- **Prisma** — Next-generation ORM (optional) — v7 for SQLite/PostgreSQL/MySQL, v6.19 for MongoDB
- **SQLite** — File-based, zero config (with better-sqlite3 adapter)
- **PostgreSQL** — Production-ready (with @prisma/adapter-pg)
- **MySQL** — Production-ready (with @prisma/adapter-mariadb)
- **MongoDB** — Document database via Prisma v6.19 (requires replica set)

## 🗄️ Database Support

Database is **optional** for `api`, `web`, and `cli` templates and **not available** for the `npm` template.

### SQLite

Zero configuration — Kickpress sets it up automatically and runs `db:push` immediately.

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL

Kickpress generates all config files and runs `db:generate`, then shows you the next steps to run after configuring your connection string.

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

### MySQL

Kickpress generates all config files and runs `db:generate`, then shows you the next steps to run after configuring your connection string.

```env
DATABASE_URL="mysql://user:password@localhost:3306/database"
```

### MongoDB

Kickpress uses **Prisma v6.19** for MongoDB (Prisma v7 MongoDB support is pending). It generates all config files and runs `db:generate` + `db:push` automatically once your connection string is set.

**MongoDB requires a replica set** — Prisma uses multi-document transactions which are only available on replica sets.

```env
# Local replica set
DATABASE_URL="mongodb://127.0.0.1:27017/mydb?replicaSet=rs0&directConnection=true"

# MongoDB Atlas (replica set is built-in)
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/mydb?retryWrites=true&w=majority"
```

**Local replica set setup (one-time):**

```bash
# Start mongod with replica set mode
mongod --replSet rs0 --dbpath /your/data/path

# In another terminal, initiate the replica set (first time only)
mongosh --eval "rs.initiate()"
```

**MongoDB differences from other providers:**

- IDs are `String` (MongoDB ObjectId) instead of `Int`
- No `db:migrate` or `db:studio` scripts (not supported)
- Cannot use `switch db` to/from MongoDB (different Prisma major version)
- Uses `prisma-client-js` generator (Prisma v6) instead of `prisma-client` (Prisma v7)

### No Database

```bash
npx kickpress init my-api -t api -d none
npx kickpress add db sqlite  # add later
```

### Switching Between Providers

```bash
npx kickpress switch db postgresql  # SQLite → PostgreSQL
npx kickpress switch db mysql       # SQLite → MySQL
npx kickpress switch db sqlite      # PostgreSQL/MySQL → SQLite
```

> ⚠️ Schema and config switch automatically. Data migration is manual.
>
> ⚠️ MongoDB cannot be switched to or from. MongoDB uses Prisma v6, while SQLite/PostgreSQL/MySQL use Prisma v7. Create a new project with your desired database instead.

## 🧪 Testing Your API

Each generated resource includes an `.http` file. Use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension:

1. Open `requests/user.http`
2. Click "Send Request" above any request

Or use curl:

```bash
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

## 🐛 Troubleshooting

### Prisma Client errors

```bash
pnpm db:generate
```

### Port already in use

```env
PORT=3001
```

### PostgreSQL connection errors

```bash
pg_isready
psql "postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Common causes: wrong credentials, database doesn't exist, SSL required (`?sslmode=require`).

### MongoDB connection errors

```bash
mongosh "mongodb://127.0.0.1:27017"
```

Common causes:
- **Not a replica set**: Prisma requires MongoDB to run as a replica set. Start with `mongod --replSet rs0` and run `rs.initiate()` once in `mongosh`.
- **Wrong port**: If port 27017 is in use by a system MongoDB service, try a different port (`--port 27018`) and update `DATABASE_URL` accordingly.
- **Missing `directConnection=true`**: Required for local single-node replica sets (`?directConnection=true`).
- **Atlas connection**: Make sure your IP is allowlisted in MongoDB Atlas Network Access.

## ❓ FAQ

**Q: Can I use this in production?**
A: Yes! Use PostgreSQL for production and add authentication, CORS, and rate limiting as needed.

**Q: What databases are supported?**
A: SQLite, PostgreSQL, MySQL, and MongoDB. All four are fully supported.

**Q: Can I add a database to a CLI project?**
A: Yes! Run `npx kickpress add db sqlite` (or another provider) from inside your CLI project.

**Q: Can I switch from SQLite to PostgreSQL later?**
A: Yes! Run `npx kickpress switch db postgresql`. Your schema models are preserved — only the provider and adapter change. Data migration is manual.

**Q: Can I switch to or from MongoDB?**
A: No. MongoDB uses Prisma v6.19 while SQLite/PostgreSQL/MySQL use Prisma v7. These are not compatible in the same project. Create a new project with your desired database instead.

**Q: Why doesn't `db:push` run automatically for PostgreSQL/MySQL?**
A: PostgreSQL and MySQL require a running server and a valid connection string. Kickpress sets up all config files and generates the client, then shows you the exact commands to run once `DATABASE_URL` is configured.

**Q: Does MongoDB work without a replica set?**
A: No. Prisma requires MongoDB to run as a replica set (even locally) to support multi-document transactions. For local dev, start `mongod --replSet rs0` and run `rs.initiate()` once in `mongosh`. For production, use MongoDB Atlas.

**Q: Why is MongoDB on Prisma v6 and not v7?**
A: Prisma v7 MongoDB support is pending. Kickpress uses Prisma v6.19 for MongoDB projects, which is the latest stable release with full MongoDB support. When Prisma v7 adds MongoDB support, `kickpress switch db` will be updated accordingly.

**Q: What are starters?**
A: Starters are optional pre-built starting points. Run `kickpress init` interactively to pick one — a full Todo CRUD API for `api`/`web`, or a math library/CLI for `npm`/`cli`. The `-y` flag always uses blank.

**Q: How is this different from NestJS?**
A: NestJS is a framework. Kickpress generates plain Express.js code with no framework lock-in.

**Q: Can I customize the generated code?**
A: Absolutely — it's all yours to modify.

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
