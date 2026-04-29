import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { select } from "@inquirer/prompts";

import { generateModel } from "@/lib/commands/make/generators/model.js";
import { generateService } from "@/lib/commands/make/generators/service.js";
import { generateController } from "@/lib/commands/make/generators/controller.js";
import { generateValidations } from "@/lib/commands/make/generators/validation.js";
import { generateRoutes } from "@/lib/commands/make/generators/routes.js";
import { generateHttpRequests } from "@/lib/commands/make/generators/http.js";
import { injectRouteIntoIndex } from "@/lib/commands/make/injectors/index-injector.js";
import type { ProjectConfig as MakeProjectConfig } from "@/lib/commands/make/detect.js";

// ── Prompt ────────────────────────────────────────────────────────────────────

const STARTER_CHOICES: Record<string, { name: string; value: string; description: string }[]> = {
  api: [
    { name: "Blank", value: "blank", description: "Empty project — add resources with kickpress make" },
    { name: "Todo", value: "todo", description: "Pre-built Todo CRUD API (SQLite, ready to run)" },
  ],
  web: [
    { name: "Blank", value: "blank", description: "Empty project" },
    { name: "Todo", value: "todo", description: "Todo API + simple HTML/CSS/JS frontend" },
  ],
  npm: [
    { name: "Blank", value: "blank", description: "Empty package with a hello() export" },
    { name: "Math library", value: "math", description: "sum, subtract, multiply, divide — ready-to-publish example" },
  ],
  cli: [
    { name: "Blank", value: "blank", description: "Empty CLI with a hello command" },
    { name: "Math CLI", value: "math", description: "add, subtract, multiply, divide commands — e.g. my-cli multiply 2 4" },
  ],
};

export const promptForStarter = async (template: string): Promise<string> => {
  const choices = STARTER_CHOICES[template] ?? [{ name: "Blank", value: "blank", description: "Empty project" }];
  return await select({
    message: "Which starter would you like?",
    choices,
  });
};

// ── Todo starter ──────────────────────────────────────────────────────────────

export const applyTodoStarter = async (
  projectPath: string,
  typescript: boolean,
  packageManager: string,
  template: string,
): Promise<void> => {
  const ext = typescript ? "ts" : "js";

  const makeConfig: MakeProjectConfig = {
    typescript,
    packageManager: packageManager as "pnpm" | "npm" | "yarn",
    srcDir: "src",
    fileExtension: ext,
    hasDatabase: true,
  };

  await generateModel(projectPath, "todo", "Todo", makeConfig);
  await generateService(projectPath, "todo", "Todo", makeConfig);
  await generateController(projectPath, "todo", "Todo", "todos", makeConfig);
  await generateValidations(projectPath, "todo", makeConfig);
  await generateRoutes(projectPath, "todo", makeConfig);
  await injectRouteIntoIndex(projectPath, "todo", "/todos", makeConfig);
  await generateHttpRequests(projectPath, "todo", "todos", "/todos");

  // Append complete Todo model to schema (with actual fields, not a stub)
  const schemaPath = join(projectPath, "prisma", "schema.prisma");
  const schema = readFileSync(schemaPath, "utf-8");
  writeFileSync(
    schemaPath,
    schema +
      `
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
  );

  // Override validation with pre-filled Todo schemas
  const validationPath = join(projectPath, "src", "validations", `todo.validation.${ext}`);
  writeFileSync(validationPath, todoValidation(typescript));

  // Override types with Todo-specific fields (TS only)
  if (typescript) {
    const typesPath = join(projectPath, "src", "types", "todo.d.ts");
    writeFileSync(typesPath, todoTypes());
  }

  // For web template: replace the frontend with a working todo UI
  if (template === "web") {
    writeTodoWebFrontend(projectPath);
  }
};

const todoValidation = (typescript: boolean): string => {
  if (typescript) {
    return `import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const todoCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  completed: z.boolean().optional().default(false),
});

const todoUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});

const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\\d+$/, "ID must be a positive integer")
    .transform(Number)
    .refine((n) => n > 0 && n <= Number.MAX_SAFE_INTEGER, {
      message: "ID out of valid range",
    }),
});

const validate = (schema: z.ZodSchema, source: "body" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === "body" ? req.body : req.params;
      const validated = schema.parse(data);
      if (source === "body") req.body = validated;
      else req.params = validated as any;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        });
      } else {
        next(err);
      }
    }
  };
};

export const validateTodoCreate = validate(todoCreateSchema, "body");
export const validateTodoUpdate = validate(todoUpdateSchema, "body");
export const validateTodoId = validate(idParamSchema, "params");

export { todoCreateSchema, todoUpdateSchema, idParamSchema };
`;
  }

  return `import { z } from "zod";

const todoCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  completed: z.boolean().optional().default(false),
});

const todoUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});

const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\\d+$/, "ID must be a positive integer")
    .transform(Number)
    .refine((n) => n > 0 && n <= Number.MAX_SAFE_INTEGER, {
      message: "ID out of valid range",
    }),
});

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = source === "body" ? req.body : req.params;
      const validated = schema.parse(data);
      if (source === "body") req.body = validated;
      else req.params = validated;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        });
      } else {
        next(err);
      }
    }
  };
};

export const validateTodoCreate = validate(todoCreateSchema, "body");
export const validateTodoUpdate = validate(todoUpdateSchema, "body");
export const validateTodoId = validate(idParamSchema, "params");

export { todoCreateSchema, todoUpdateSchema, idParamSchema };
`;
};

const todoTypes = (): string => `export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoCreateInput = Pick<Todo, "title"> & { completed?: boolean };
export type TodoUpdateInput = Partial<Pick<Todo, "title" | "completed">>;
`;

const writeTodoWebFrontend = (projectPath: string): void => {
  writeFileSync(
    join(projectPath, "public", "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Todos</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="container">
      <h1>📋 Todos</h1>
      <form id="form">
        <input id="input" type="text" placeholder="What needs to be done?" required />
        <button type="submit">Add</button>
      </form>
      <ul id="list"></ul>
    </div>
    <script src="/app.js"></script>
  </body>
</html>`,
  );

  writeFileSync(
    join(projectPath, "public", "styles.css"),
    `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #f5f5f5; min-height: 100vh; }
.container { max-width: 560px; margin: 3rem auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
h1 { margin-bottom: 1.5rem; font-size: 1.4rem; }
form { display: flex; gap: .5rem; margin-bottom: 1.5rem; }
input[type="text"] { flex: 1; padding: .5rem .75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; outline: none; }
input[type="text"]:focus { border-color: #4f46e5; }
button[type="submit"] { padding: .5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
button[type="submit"]:hover { background: #4338ca; }
ul { list-style: none; }
li { display: flex; align-items: center; gap: .75rem; padding: .75rem 0; border-bottom: 1px solid #f0f0f0; }
li:last-child { border-bottom: none; }
li.done span { text-decoration: line-through; color: #aaa; }
input[type="checkbox"] { width: 1.1rem; height: 1.1rem; cursor: pointer; accent-color: #4f46e5; }
.delete { margin-left: auto; background: none; border: none; color: #ccc; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 .2rem; }
.delete:hover { color: #ef4444; }
`,
  );

  writeFileSync(
    join(projectPath, "public", "app.js"),
    `const list = document.getElementById("list");
const form = document.getElementById("form");
const input = document.getElementById("input");

const render = (todos) => {
  list.innerHTML = todos
    .map(
      (t) => \`<li class="\${t.completed ? "done" : ""}" data-id="\${t.id}">
      <input type="checkbox" \${t.completed ? "checked" : ""} onchange="toggle(\${t.id}, this.checked)" />
      <span>\${t.title}</span>
      <button class="delete" onclick="remove(\${t.id})">✕</button>
    </li>\`,
    )
    .join("");
};

const load = async () => {
  const res = await fetch("/todos");
  render(await res.json());
};

form.onsubmit = async (e) => {
  e.preventDefault();
  await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.value }),
  });
  input.value = "";
  load();
};

const toggle = async (id, completed) => {
  await fetch(\`/todos/\${id}\`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  load();
};

const remove = async (id) => {
  await fetch(\`/todos/\${id}\`, { method: "DELETE" });
  load();
};

load();
`,
  );
};

// ── Math npm starter ──────────────────────────────────────────────────────────

export const applyMathNpmStarter = (
  projectPath: string,
  typescript: boolean,
  projectName: string,
): void => {
  const ext = typescript ? "ts" : "js";
  const content = typescript
    ? `/**
 * ${projectName} — math utility library
 */

export const sum = (a: number, b: number): number => a + b;

export const subtract = (a: number, b: number): number => a - b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};
`
    : `/**
 * ${projectName} — math utility library
 */

export const sum = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export const multiply = (a, b) => a * b;

export const divide = (a, b) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};
`;

  writeFileSync(join(projectPath, "src", `index.${ext}`), content);
};

// ── Math CLI starter ──────────────────────────────────────────────────────────

export const applyMathCliStarter = (
  projectPath: string,
  typescript: boolean,
  projectName: string,
): void => {
  const ext = typescript ? "ts" : "js";
  const content = `#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();
program
  .name(process.env.npm_package_name || "${projectName}")
  .description("${projectName} — math CLI")
  .version("0.0.1");

program
  .command("add <a> <b>")
  .description("Add two numbers")
  .action((a${typescript ? ": string" : ""}, b${typescript ? ": string" : ""}) => {
    console.log(Number(a) + Number(b));
  });

program
  .command("subtract <a> <b>")
  .description("Subtract b from a")
  .action((a${typescript ? ": string" : ""}, b${typescript ? ": string" : ""}) => {
    console.log(Number(a) - Number(b));
  });

program
  .command("multiply <a> <b>")
  .description("Multiply two numbers")
  .action((a${typescript ? ": string" : ""}, b${typescript ? ": string" : ""}) => {
    console.log(Number(a) * Number(b));
  });

program
  .command("divide <a> <b>")
  .description("Divide a by b")
  .action((a${typescript ? ": string" : ""}, b${typescript ? ": string" : ""}) => {
    if (Number(b) === 0) {
      console.error("Error: Division by zero");
      process.exit(1);
    }
    console.log(Number(a) / Number(b));
  });

program.parse();
`;

  writeFileSync(join(projectPath, "src", `cli.${ext}`), content);
};
