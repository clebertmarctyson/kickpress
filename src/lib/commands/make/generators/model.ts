import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const generateModel = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  const modelsDir = join(workingDir, config.srcDir, "models");

  if (!existsSync(modelsDir)) {
    mkdirSync(modelsDir, { recursive: true });
  }

  const modelFile = join(modelsDir, `${entity}.model.${config.fileExtension}`);

  const content = config.typescript
    ? generateTypeScriptModel(entity, entityCapitalized)
    : generateJavaScriptModel(entity);

  writeFileSync(modelFile, content);
};

const generateTypeScriptModel = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import prisma from "../lib/prisma";
import type {
  ${entityCapitalized},
  ${entityCapitalized}CreateInput,
  ${entityCapitalized}UpdateInput,
} from "../types/${entity}";

const ${entity}FindAll = async (): Promise<${entityCapitalized}[]> => {
  return prisma.${entity}.findMany();
};

const ${entity}FindOne = async (id: number): Promise<${entityCapitalized} | null> => {
  return prisma.${entity}.findUnique({
    where: { id },
  });
};

const ${entity}Create = async (data: ${entityCapitalized}CreateInput): Promise<${entityCapitalized}> => {
  return prisma.${entity}.create({
    data,
  });
};

const ${entity}Update = async (
  id: number,
  data: ${entityCapitalized}UpdateInput
): Promise<${entityCapitalized} | null> => {
  return prisma.${entity}.update({
    where: { id },
    data,
  });
};

const ${entity}Delete = async (id: number): Promise<${entityCapitalized} | null> => {
  return prisma.${entity}.delete({
    where: { id },
  });
};

export {
  ${entity}FindAll,
  ${entity}FindOne,
  ${entity}Create,
  ${entity}Update,
  ${entity}Delete,
};
`;
};

const generateJavaScriptModel = (entity: string): string => {
  return `import prisma from "../lib/prisma.js";

const ${entity}FindAll = async () => {
  return prisma.${entity}.findMany();
};

const ${entity}FindOne = async (id) => {
  return prisma.${entity}.findUnique({
    where: { id },
  });
};

const ${entity}Create = async (data) => {
  return prisma.${entity}.create({
    data,
  });
};

const ${entity}Update = async (id, data) => {
  return prisma.${entity}.update({
    where: { id },
    data,
  });
};

const ${entity}Delete = async (id) => {
  return prisma.${entity}.delete({
    where: { id },
  });
};

export {
  ${entity}FindAll,
  ${entity}FindOne,
  ${entity}Create,
  ${entity}Update,
  ${entity}Delete,
};
`;
};
