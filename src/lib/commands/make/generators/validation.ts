import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";
import { capitalizeFirst } from "@/lib/utils/index.js";

export const generateValidations = async (
  workingDir: string,
  entity: string,
  config: ProjectConfig
): Promise<void> => {
  const validationsDir = join(workingDir, config.srcDir, "validations");

  if (!existsSync(validationsDir)) {
    mkdirSync(validationsDir, { recursive: true });
  }

  const validationFile = join(
    validationsDir,
    `${entity}.validation.${config.fileExtension}`
  );

  const content = config.typescript
    ? generateTypeScriptValidations(entity)
    : generateJavaScriptValidations(entity);

  writeFileSync(validationFile, content);
};

const generateTypeScriptValidations = (entity: string): string => {
  return `import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation schemas
const ${entity}CreateSchema = z.object({
  // Add your fields here after extending the Prisma model
});

const ${entity}UpdateSchema = z.object({
  // Add your fields here (make them optional)
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

// Validation middleware factory
const validate = (schema: z.ZodSchema, source: "body" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === "body" ? req.body : req.params;
      const validated = schema.parse(data);
      
      if (source === "body") {
        req.body = validated;
      } else {
        req.params = validated as any;
      }
      
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      } else {
        next(err);
      }
    }
  };
};

// Export validation middlewares
export const validate${capitalizeFirst(
    entity
  )}Create = validate(${entity}CreateSchema, "body");
export const validate${capitalizeFirst(
    entity
  )}Update = validate(${entity}UpdateSchema, "body");
export const validate${capitalizeFirst(
    entity
  )}Id = validate(idParamSchema, "params");

// Export schemas for reuse if needed
export { ${entity}CreateSchema, ${entity}UpdateSchema, idParamSchema };
`;
};

const generateJavaScriptValidations = (entity: string): string => {
  return `import { z } from "zod";

// Validation schemas
const ${entity}CreateSchema = z.object({
  // Add your fields here after extending the Prisma model
});

const ${entity}UpdateSchema = z.object({
  // Add your fields here (make them optional)
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

// Validation middleware factory
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = source === "body" ? req.body : req.params;
      const validated = schema.parse(data);
      
      if (source === "body") {
        req.body = validated;
      } else {
        req.params = validated;
      }
      
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      } else {
        next(err);
      }
    }
  };
};

// Export validation middlewares
export const validate${capitalizeFirst(
    entity
  )}Create = validate(${entity}CreateSchema, "body");
export const validate${capitalizeFirst(
    entity
  )}Update = validate(${entity}UpdateSchema, "body");
export const validate${capitalizeFirst(
    entity
  )}Id = validate(idParamSchema, "params");

// Export schemas for reuse if needed
export { ${entity}CreateSchema, ${entity}UpdateSchema, idParamSchema };
`;
};
