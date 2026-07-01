import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";
import { Database } from "@/lib/types/index.js";

export const generateModel = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  const entityDir = join(workingDir, config.srcDir, entity);

  if (!existsSync(entityDir)) {
    mkdirSync(entityDir, { recursive: true });
  }

  const modelFile = join(entityDir, `${entity}.model.${config.fileExtension}`);

  const isMongo = config.database === Database.MongoDB;

  const content = config.typescript
    ? generateTypeScriptModel(entity, entityCapitalized, isMongo)
    : generateJavaScriptModel(entity, entityCapitalized, isMongo);

  writeFileSync(modelFile, content);
};

const generateTypeScriptModel = (
  entity: string,
  entityCapitalized: string,
  isMongo: boolean,
): string => {
  const idType = isMongo ? "string" : "number";

  return `import prisma from "../lib/prisma";
import type {
  ${entityCapitalized},
  ${entityCapitalized}CreateInput,
  ${entityCapitalized}UpdateInput,
} from "./${entity}.types";

export class ${entityCapitalized}Model {
  async findAll(): Promise<${entityCapitalized}[]> {
    return prisma.${entity}.findMany();
  }

  async findOne(id: ${idType}): Promise<${entityCapitalized} | null> {
    return prisma.${entity}.findUnique({
      where: { id },
    });
  }

  async create(data: ${entityCapitalized}CreateInput): Promise<${entityCapitalized}> {
    return prisma.${entity}.create({
      data,
    });
  }

  async update(id: ${idType}, data: ${entityCapitalized}UpdateInput): Promise<${entityCapitalized} | null> {
    return prisma.${entity}.update({
      where: { id },
      data,
    });
  }

  async delete(id: ${idType}): Promise<${entityCapitalized} | null> {
    return prisma.${entity}.delete({
      where: { id },
    });
  }
}
`;
};

const generateJavaScriptModel = (entity: string, entityCapitalized: string, _isMongo: boolean): string => {
  return `import prisma from "../lib/prisma.js";

export class ${entityCapitalized}Model {
  async findAll() {
    return prisma.${entity}.findMany();
  }

  async findOne(id) {
    return prisma.${entity}.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return prisma.${entity}.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.${entity}.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.${entity}.delete({
      where: { id },
    });
  }
}
`;
};
