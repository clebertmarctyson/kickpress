import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";
import { Database } from "@/lib/types/index.js";

export const generateController = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  tableName: string,
  config: ProjectConfig
): Promise<void> => {
  const entityDir = join(workingDir, config.srcDir, entity);

  if (!existsSync(entityDir)) {
    mkdirSync(entityDir, { recursive: true });
  }

  const controllerFile = join(
    entityDir,
    `${entity}.controller.${config.fileExtension}`
  );

  const isMongo = config.database === Database.MongoDB;

  const content = config.typescript
    ? generateTypeScriptController(entity, entityCapitalized, tableName, isMongo)
    : generateJavaScriptController(entity, entityCapitalized, tableName, isMongo);

  writeFileSync(controllerFile, content);
};

const generateTypeScriptController = (
  entity: string,
  entityCapitalized: string,
  tableName: string,
  isMongo: boolean,
): string => {
  const parseId = isMongo ? "id" : "Number(id)";

  return `import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ${entityCapitalized}Service } from "./${entity}.service";

export class ${entityCapitalized}Controller {
  constructor(private service: ${entityCapitalized}Service) {}

  all = asyncHandler(async (_: Request, res: Response) => {
    const ${tableName} = await this.service.getAll();
    res.json(${tableName});
  });

  findOne = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const ${entity} = await this.service.getOne(${parseId});

    if (!${entity}) {
      res.status(404);
      throw new Error("${entityCapitalized} not found");
    }

    res.json(${entity});
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const ${entity} = await this.service.create(req.body);
    res.status(201).json(${entity});
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const ${entity} = await this.service.getOne(${parseId});

    if (!${entity}) {
      res.status(404);
      throw new Error("${entityCapitalized} not found");
    }

    const updated${entityCapitalized} = await this.service.update(${entity}.id, req.body);
    res.json(updated${entityCapitalized});
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const ${entity} = await this.service.getOne(${parseId});

    if (!${entity}) {
      res.status(404);
      throw new Error("${entityCapitalized} not found");
    }

    await this.service.delete(${entity}.id);
    res.status(204).send();
  });
}
`;
};

const generateJavaScriptController = (
  entity: string,
  entityCapitalized: string,
  tableName: string,
  isMongo: boolean,
): string => {
  const parseId = isMongo ? "id" : "Number(id)";

  return `import asyncHandler from "express-async-handler";
import { ${entityCapitalized}Service } from "./${entity}.service.js";

export class ${entityCapitalized}Controller {
  constructor(service) {
    this.service = service;
  }

  all = asyncHandler(async (_, res) => {
    const ${tableName} = await this.service.getAll();
    res.json(${tableName});
  });

  findOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ${entity} = await this.service.getOne(${parseId});

    if (!${entity}) {
      res.status(404);
      throw new Error("${entityCapitalized} not found");
    }

    res.json(${entity});
  });

  create = asyncHandler(async (req, res) => {
    const ${entity} = await this.service.create(req.body);
    res.status(201).json(${entity});
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ${entity} = await this.service.getOne(${parseId});

    if (!${entity}) {
      res.status(404);
      throw new Error("${entityCapitalized} not found");
    }

    const updated${entityCapitalized} = await this.service.update(${entity}.id, req.body);
    res.json(updated${entityCapitalized});
  });

  remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ${entity} = await this.service.getOne(${parseId});

    if (!${entity}) {
      res.status(404);
      throw new Error("${entityCapitalized} not found");
    }

    await this.service.delete(${entity}.id);
    res.status(204).send();
  });
}
`;
};
