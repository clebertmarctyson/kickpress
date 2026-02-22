import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const generateController = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  tableName: string,
  config: ProjectConfig
): Promise<void> => {
  const controllersDir = join(workingDir, config.srcDir, "controllers");

  if (!existsSync(controllersDir)) {
    mkdirSync(controllersDir, { recursive: true });
  }

  const controllerFile = join(
    controllersDir,
    `${entity}.controller.${config.fileExtension}`
  );

  const content = config.typescript
    ? generateTypeScriptController(entity, entityCapitalized, tableName)
    : generateJavaScriptController(entity, entityCapitalized, tableName);

  writeFileSync(controllerFile, content);
};

const generateTypeScriptController = (
  entity: string,
  entityCapitalized: string,
  tableName: string
): string => {
  return `import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  getAll${entityCapitalized}s,
  get${entityCapitalized},
  create${entityCapitalized},
  update${entityCapitalized},
  delete${entityCapitalized},
} from "../services/${entity}.service";

const all = asyncHandler(async (_: Request, res: Response) => {
  const ${tableName} = await getAll${entityCapitalized}s();
  res.json(${tableName});
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ${entity} = await get${entityCapitalized}(Number(id));

  if (!${entity}) {
    res.status(404);
    throw new Error("${entityCapitalized} not found");
  }

  res.json(${entity});
});

const create = asyncHandler(async (req: Request, res: Response) => {
  const ${entity} = await create${entityCapitalized}(req.body);
  res.status(201).json(${entity});
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ${entity} = await get${entityCapitalized}(Number(id));

  if (!${entity}) {
    res.status(404);
    throw new Error("${entityCapitalized} not found");
  }

  const updated${entityCapitalized} = await update${entityCapitalized}(${entity}.id, req.body);
  res.json(updated${entityCapitalized});
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ${entity} = await get${entityCapitalized}(Number(id));

  if (!${entity}) {
    res.status(404);
    throw new Error("${entityCapitalized} not found");
  }

  await delete${entityCapitalized}(${entity}.id);
  res.status(204).send();
});

export { all, findOne, create, update, remove };
`;
};

const generateJavaScriptController = (
  entity: string,
  entityCapitalized: string,
  tableName: string
): string => {
  return `import asyncHandler from "express-async-handler";
import {
  getAll${entityCapitalized}s,
  get${entityCapitalized},
  create${entityCapitalized},
  update${entityCapitalized},
  delete${entityCapitalized},
} from "../services/${entity}.service.js";

const all = asyncHandler(async (_, res) => {
  const ${tableName} = await getAll${entityCapitalized}s();
  res.json(${tableName});
});

const findOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ${entity} = await get${entityCapitalized}(Number(id));

  if (!${entity}) {
    res.status(404);
    throw new Error("${entityCapitalized} not found");
  }

  res.json(${entity});
});

const create = asyncHandler(async (req, res) => {
  const ${entity} = await create${entityCapitalized}(req.body);
  res.status(201).json(${entity});
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ${entity} = await get${entityCapitalized}(Number(id));

  if (!${entity}) {
    res.status(404);
    throw new Error("${entityCapitalized} not found");
  }

  const updated${entityCapitalized} = await update${entityCapitalized}(${entity}.id, req.body);
  res.json(updated${entityCapitalized});
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ${entity} = await get${entityCapitalized}(Number(id));

  if (!${entity}) {
    res.status(404);
    throw new Error("${entityCapitalized} not found");
  }

  await delete${entityCapitalized}(${entity}.id);
  res.status(204).send();
});

export { all, findOne, create, update, remove };
`;
};
