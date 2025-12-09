# ☕ Kickpress CLI

> A fast and opinionated CLI for scaffolding Express.js projects with TypeScript, Prisma, and security-first best practices built-in.

Kickpress helps you create production-ready Express.js APIs in seconds, with full CRUD generation, input validation, type safety, and modern tooling.

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
    - [SQLite Setup](#sqlite-setup)
    - [PostgreSQL Setup](#postgresql-setup)
  - [📁 Generated Project Structure](#-generated-project-structure)
  - [🎨 Generated Code Examples](#-generated-code-examples)
    - [Controller](#controller)
    - [Routes (with Validation)](#routes-with-validation)
    - [Validation](#validation)
    - [Model](#model)
  - [🔒 Security \& Validation](#-security--validation)
    - [Built-in Protection](#built-in-protection)
    - [Validation Examples](#validation-examples)
    - [Customizing Validation](#customizing-validation)
    - [Security Best Practices](#security-best-practices)
  - [🔧 Available Scripts](#-available-scripts)
  - [🛠️ Technology Stack](#️-technology-stack)
    - [Core](#core)
    - [Development](#development)
    - [Database](#database)
  - [🎯 Key Features Explained](#-key-features-explained)
    - [1. Automatic Setup](#1-automatic-setup)
    - [2. Type Safety](#2-type-safety)
    - [3. Input Validation](#3-input-validation)
    - [4. Error Handling](#4-error-handling)
    - [5. Smart Pluralization](#5-smart-pluralization)
    - [6. Auto-Injection](#6-auto-injection)
    - [7. Modern Node.js](#7-modern-nodejs)
  - [🗄️ Database Support](#️-database-support)
    - [SQLite (Default)](#sqlite-default)
    - [PostgreSQL](#postgresql)
  - [🧪 Testing Your API](#-testing-your-api)
    - [Using HTTP Files](#using-http-files)
    - [Using curl](#using-curl)
  - [🐛 Troubleshooting](#-troubleshooting)
    - [pnpm: "Cannot find module" errors](#pnpm-cannot-find-module-errors)
    - [Prisma Client errors](#prisma-client-errors)
    - [Port already in use](#port-already-in-use)
    - [PostgreSQL connection errors](#postgresql-connection-errors)
    - [Validation not working](#validation-not-working)
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
- 🔒 **Security First** - Built-in input validation with Zod on all endpoints
- 📦 **TypeScript First** - Full TypeScript support with proper types (JavaScript optional)
- 🗄️ **Multiple Databases** - SQLite (default) and PostgreSQL support with Prisma adapters
- 🎯 **CRUD Generation** - Generate routes, controllers, models, and validators instantly
- 🔄 **Auto-injection** - Routes automatically added to your app
- ⚡ **Modern Stack** - Express, Prisma, Zod, tsx, and express-async-handler
- 🛡️ **Error Handling** - Comprehensive error middleware included
- 📝 **HTTP Requests** - Test files generated for each resource
- 🎨 **Best Practices** - Follows industry standards and security conventions
- ⚙️ **Zero Configuration** - Everything works out of the box

## ⚡ Why Kickpress?

| Task                 | Manual Setup          | With Kickpress  |
| -------------------- | --------------------- | --------------- |
| Project Setup        | 15-30 minutes         | 30 seconds      |
| Prisma Configuration | Manual config         | Auto-configured |
| Input Validation     | Write from scratch    | Auto-generated  |
| CRUD Generation      | Write from scratch    | 1 command       |
| Error Handling       | Custom implementation | Built-in        |
| Type Safety          | Manual types          | Auto-generated  |
| Route Registration   | Manual import         | Auto-injected   |
| Database Setup       | Multiple commands     | Automated       |

## 📋 Requirements

- **Node.js**: v20.0.0 or higher (for `--env-file` support)
- **Package Manager**: npm, pnpm, or yarn
- **Operating System**: macOS, Linux, or Windows
- **PostgreSQL**: Required if using PostgreSQL database option

> **Note**: Kickpress uses Node.js native `--env-file` flag. For Node.js < v20, you may need additional configuration.

## 🚀 Quick Start

**SQLite (Default):**

```bash
# Create a new project
npx kickpress kick my-api

# Navigate to project
cd my-api

# Start development server (dependencies already installed!)
pnpm dev
```

**PostgreSQL:**

```bash
# Create a new project with PostgreSQL
npx kickpress kick my-api --database postgresql

# Navigate to project
cd my-api

# Update DATABASE_URL in .env with your PostgreSQL connection string
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Run database setup
pnpm db:generate
pnpm db:push

# Start development server
pnpm dev
```

Your API is now running at `http://localhost:3000`! 🎉

> **Note:** Dependencies are automatically installed during project creation. SQLite database is also auto-initialized. PostgreSQL requires manual connection string configuration.

## ⚠️ Important: Using pnpm

If you use **pnpm** as your package manager, you might need to approve native builds:

**For SQLite:**

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
- `-d, --database <database>` - Database provider: `sqlite` | `postgresql` (default: "sqlite")
- `--typescript` - Use TypeScript (default: true)
- `--no-typescript` - Use JavaScript instead
- `-h, --help` - Display help for command

**Examples:**

```bash
# Interactive mode (recommended for first-time users)
npx kickpress kick

# Quick TypeScript project with SQLite (default)
npx kickpress kick my-api

# Create project with PostgreSQL
npx kickpress kick my-api --database postgresql
npx kickpress kick my-api -d postgresql

# Using aliases
npx kickpress k my-api
npx kickpress new my-api
npx kickpress n my-api
npx kickpress create my-api
npx kickpress c my-api
npx kickpress init my-api
npx kickpress i my-api

# JavaScript project with PostgreSQL
npx kickpress kick my-api --no-typescript -d postgresql
```

**What it does automatically:**

- ✅ Creates complete folder structure
- ✅ Generates all configuration files
- ✅ Installs all dependencies (including Zod for validation)
- ✅ Generates Prisma Client (SQLite only)
- ✅ Pushes initial schema to database (SQLite only)
- ✅ Sets up error handling middleware
- ✅ Configures TypeScript/JavaScript

**PostgreSQL Note:** When using PostgreSQL, you must manually configure the `DATABASE_URL` in `.env` before running `db:generate` and `db:push`.

---

### `make` - Generate Resources

Generates CRUD resources for any entity with full type safety and input validation. **Automatically updates database after generation.**

**Syntax:**

```bash
kickpress make <entity> <component> [options]
```

**Aliases:** `m`, `generate`, `gen`, `g`

**Arguments:**

- `entity` - Name of the entity (singular, e.g., user, post, product)
- `component` - What to generate:
  - `resources` - Everything (routes, controller, model, validation, types, schema, HTTP requests)
  - `routes` - Only route definitions
  - `controller` - Only controller logic
  - `model` - Only Prisma model operations
  - `validation` - Only validation schemas

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
npx kickpress make user validation

# Force overwrite existing files
npx kickpress make user resources --force
```

**What it generates:**

| Component         | Description                                | Files Created                      |
| ----------------- | ------------------------------------------ | ---------------------------------- |
| **Routes**        | RESTful endpoints with full CRUD           | `routes/entity.routes.ts`          |
| **Controller**    | Request handlers with async error handling | `controllers/entity.controller.ts` |
| **Model**         | Prisma database operations                 | `models/entity.model.ts`           |
| **Validation**    | Zod schemas and middleware                 | `validations/entity.validation.ts` |
| **Types**         | TypeScript interfaces (if TS project)      | `types/entity.d.ts`                |
| **Schema**        | Updates Prisma schema                      | `prisma/schema.prisma`             |
| **HTTP Requests** | Test file for API endpoints                | `requests/entity.http`             |

**What it does automatically:**

- ✅ Prompts for table name (plural form)
- ✅ Prompts for route path
- ✅ Generates all necessary files with validation
- ✅ Auto-injects routes into `src/index.ts`
- ✅ Runs `prisma generate`
- ✅ Runs `prisma db push`

## 📋 Complete Workflow Example

### SQLite Setup

**1. Create Project:**

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

**2. Generate Resources:**

```bash
cd blog-api
npx kickpress make post resources
```

**3. Start Development:**

```bash
pnpm dev
```

### PostgreSQL Setup

**1. Create Project:**

```bash
npx kickpress kick blog-api --database postgresql
```

**Prompts:**

```
✔ What is your project name? · blog-api
✔ Would you like to use TypeScript? · Yes
✔ Which database would you like to use? · postgresql
✔ Which package manager would you like to use? · pnpm

☕ Creating Kickpress project: blog-api

📁 Creating project structure...
📝 Creating project files...
✅ Project created successfully!

📦 Installing dependencies...
✅ Dependencies installed!

Next steps:
cd blog-api
🚨 Update DATABASE_URL in .env file with your database URL
pnpm db:generate
pnpm db:push
pnpm dev
```

**2. Configure Database:**

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/blogdb?schema=public"
```

**3. Initialize Database:**

```bash
cd blog-api
pnpm db:generate
pnpm db:push
```

**4. Generate Resources:**

```bash
npx kickpress make post resources
```

**5. Customize Schema:**

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

**6. Update Database:**

```bash
pnpm db:generate
pnpm db:push
```

**7. Start Development:**

```bash
pnpm dev
```

**8. Test Your API:**

Use the generated `requests/post.http` file or curl:

```bash
# Get all posts
curl http://localhost:3000/posts

# Create a post (validation enforced)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","author":"You"}'

# Invalid request (validation fails)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":""}'
# Returns: {"error": "Invalid input", "details": [...]}
```

## 📁 Generated Project Structure

```
my-api/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client with adapter
│   │   └── generated/              # Prisma generated files
│   ├── controllers/
│   │   └── user.controller.ts      # Request handlers
│   ├── models/
│   │   └── user.model.ts           # Database operations
│   ├── routes/
│   │   └── user.routes.ts          # Express routes with validation
│   ├── validations/
│   │   └── user.validation.ts      # Zod schemas & middleware
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

const create = asyncHandler(async (req: Request, res: Response) => {
  // req.body already validated by middleware
  const user = await userCreate(req.body);
  res.status(201).json(user);
});

export { all, findOne, create };
```

### Routes (with Validation)

```typescript
import { Router } from "express";
import {
  all,
  findOne,
  create,
  update,
  remove,
} from "../controllers/user.controller";
import {
  validateCreate,
  validateUpdate,
  validateId,
} from "../validations/user.validation";

const router = Router();

router.route("/").get(all).post(validateCreate, create); // ✅ Input validated

router
  .route("/:id")
  .get(validateId, findOne) // ✅ ID validated
  .patch(validateId, validateUpdate, update) // ✅ Both validated
  .delete(validateId, remove); // ✅ ID validated

export default router;
```

### Validation

```typescript
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Validation schemas
const userCreateSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

const userUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  age: z.number().int().positive().optional(),
});

const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

// Validation middleware
export const validateCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = userCreateSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid input",
      details: error instanceof z.ZodError ? error.errors : error,
    });
  }
};

export const validateUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = userUpdateSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid input",
      details: error instanceof z.ZodError ? error.errors : error,
    });
  }
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.params = userIdSchema.parse(req.params);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
};
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

const userCreate = async (data: UserCreateInput): Promise<User> => {
  return prisma.user.create({ data });
};

export { userFindAll, userFindOne, userCreate };
```

## 🔒 Security & Validation

### Built-in Protection

Kickpress generates secure code by default:

✅ **SQL Injection Protection** - Prisma uses parameterized queries  
✅ **Input Validation** - Zod validates all request data  
✅ **Type Coercion** - Safe type transformation  
✅ **XSS Prevention** - Proper input sanitization  
✅ **Error Information Leakage** - Safe error messages in production

### Validation Examples

**Valid Request:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","age":25}'
# ✅ Success: 201 Created
```

**Invalid Email:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"not-an-email","age":25}'
# ❌ Error: 400 Bad Request
# {"error":"Invalid input","details":[{"path":["email"],"message":"Invalid email"}]}
```

**Missing Required Field:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
# ❌ Error: 400 Bad Request
# {"error":"Invalid input","details":[{"path":["name"],"message":"Required"}]}
```

**Invalid ID Format:**

```bash
curl http://localhost:3000/users/abc
# ❌ Error: 400 Bad Request
# {"error":"Invalid ID format"}
```

### Customizing Validation

Edit `src/validations/user.validation.ts`:

```typescript
// Add custom validation rules
const userCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),

  email: z.string().email("Invalid email format").toLowerCase().trim(),

  age: z
    .number()
    .int("Age must be an integer")
    .positive("Age must be positive")
    .min(18, "Must be at least 18 years old")
    .max(120, "Invalid age")
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
});
```

### Security Best Practices

**Additional recommended middleware:**

```typescript
// src/index.ts
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start dev server with hot reload

# Build (TypeScript only)
pnpm build        # Compile to JavaScript

# Production
pnpm start        # Start production server

# Database
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Create migration
pnpm db:studio    # Open Prisma Studio
```

## 🛠️ Technology Stack

### Core

- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe JavaScript (optional)
- **Prisma** - Next-generation ORM
- **Zod** - TypeScript-first schema validation

### Development

- **tsx** - TypeScript execution engine
- **express-async-handler** - Async error handling

### Database

- **SQLite** - Default (with better-sqlite3 adapter)
- **PostgreSQL** - Production-ready (with @prisma/adapter-pg)
- Future: MySQL, MongoDB support

## 🎯 Key Features Explained

### 1. Automatic Setup

Everything is automated - no manual steps (SQLite):

- ✅ Dependency installation (including Zod)
- ✅ Prisma client generation
- ✅ Database initialization
- ✅ Schema updates
- ✅ Validation middleware

For PostgreSQL, only connection string configuration is required.

### 2. Type Safety

Full TypeScript support with generated types:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreateInput {
  name: string;
  email: string;
  age?: number;
}
```

### 3. Input Validation

Every endpoint is protected with Zod validation:

- ✅ Request body validation
- ✅ URL parameter validation
- ✅ Type transformation
- ✅ Custom error messages
- ✅ Detailed error responses

### 4. Error Handling

Comprehensive error middleware:

- ✅ Prisma errors (duplicates, not found)
- ✅ Validation errors (Zod)
- ✅ Custom errors
- ✅ Stack traces (dev only)
- ✅ Safe error messages (production)

### 5. Smart Pluralization

Solves the plural issue with prompts:

```bash
npx kickpress make city resources
✔ What should the table name be? · cities
```

### 6. Auto-Injection

Routes automatically registered with validation:

```typescript
import cityRoutes from "./routes/city.routes";
import { validateCreate } from "./validations/city.validation";
app.use("/cities", cityRoutes);
```

### 7. Modern Node.js

Uses native `--env-file` flag:

```json
{
  "scripts": {
    "dev": "tsx watch --env-file=.env src/index.ts"
  }
}
```

## 🗄️ Database Support

### SQLite (Default)

**Best for:**

- Local development
- Prototyping
- Simple applications
- Embedded systems

**Pros:**

- Zero configuration
- No external dependencies
- File-based database
- Automatic setup

**Example `.env`:**

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL

**Best for:**

- Production applications
- Scalable systems
- Complex queries
- Multi-user environments

**Pros:**

- Production-ready
- Advanced features
- Strong data integrity
- Excellent performance

**Requirements:**

- PostgreSQL server running
- Database created
- Connection credentials

**Example `.env`:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
```

**Connection String Format:**

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

**Examples:**

```env
# Local development
DATABASE_URL="postgresql://postgres:dev123@localhost:5432/blogdb?schema=public"

# Railway
DATABASE_URL="postgresql://postgres:pass@containers-us-west.railway.app:5432/railway?schema=public"

# Supabase
DATABASE_URL="postgresql://postgres:pass@db.project.supabase.co:5432/postgres?schema=public"

# Neon
DATABASE_URL="postgresql://user:pass@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## 🧪 Testing Your API

### Using HTTP Files

1. Install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) in VS Code
2. Open `requests/user.http`
3. Click "Send Request"

**Generated HTTP file includes validation examples:**

```http
### Get all users
GET http://localhost:3000/users

### Get user by ID
GET http://localhost:3000/users/1

### Create user (valid)
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25
}

### Create user (invalid - will fail validation)
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "",
  "email": "not-an-email"
}
```

### Using curl

See examples in [Security & Validation](#-security--validation)

## 🐛 Troubleshooting

### pnpm: "Cannot find module" errors

**For SQLite:**

```bash
pnpm approve-builds
# Select: better-sqlite3
```

**For PostgreSQL:**

```bash
pnpm approve-builds
# Select: @prisma/adapter-pg
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

### PostgreSQL connection errors

**Check if PostgreSQL is running:**

```bash
# macOS/Linux
pg_isready

# Or check status
sudo service postgresql status  # Linux
brew services list              # macOS
```

**Test connection:**

```bash
psql "postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**Common issues:**

- ❌ PostgreSQL not running → Start the service
- ❌ Wrong credentials → Check username/password
- ❌ Database doesn't exist → Create it first
- ❌ Port blocked → Check firewall settings
- ❌ SSL required → Add `?sslmode=require` to connection string

**Create database:**

```bash
psql -U postgres
CREATE DATABASE mydb;
\q
```

### Validation not working

**Ensure middleware is properly ordered:**

```typescript
// ✅ Correct order
router.post("/", validateCreate, create);

// ❌ Wrong order (validation bypassed)
router.post("/", create, validateCreate);
```

## 📝 Configuration

### Environment Variables

**SQLite:**

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
```

**PostgreSQL:**

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
```

**Additional Security:**

```env
# CORS
ALLOWED_ORIGINS="http://localhost:3000,https://myapp.com"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# JWT (if implementing auth)
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
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
A: Yes! The generated code is production-ready with built-in validation and security best practices. Use PostgreSQL for production. Add authentication, CORS, rate limiting, and logging as needed.

**Q: What databases are supported?**
A: SQLite (default) and PostgreSQL. MySQL and MongoDB support coming soon.

**Q: Can I switch from SQLite to PostgreSQL later?**
A: Yes! Update your `schema.prisma` provider and `DATABASE_URL`, then run migrations.

**Q: Do I need PostgreSQL installed?**
A: Only if you use the PostgreSQL option. SQLite works without any external database.

**Q: How secure is the generated code?**
A: Very secure. All endpoints have input validation, Prisma prevents SQL injection, and error handling prevents information leakage. Add additional security middleware as needed.

**Q: Can I customize validation rules?**
A: Absolutely! Edit the generated Zod schemas in `src/validations/` to fit your needs.

**Q: Can I customize generated code?**
A: Yes! All code is yours to modify. The CLI generates a starting point with best practices.

**Q: How is this different from NestJS?**
A: NestJS is a framework. Kickpress is a scaffolding tool that generates Express.js code with validation built-in.

**Q: Which database should I choose?**
A: Use SQLite for prototyping and local development. Use PostgreSQL for production applications.

**Q: Does it support authentication?**
A: Authentication is not included by default, but the validation layer makes it easy to add JWT or session-based auth.

**Q: Can I disable validation on specific endpoints?**
A: Yes! Simply remove the validation middleware from the route definition.

**Q: What if I need custom validation logic?**
A: Extend the Zod schemas or create custom middleware. Zod supports `.refine()` and `.superRefine()` for complex rules.

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
