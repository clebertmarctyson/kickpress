import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const generateService = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  const servicesDir = join(workingDir, config.srcDir, "services");

  if (!existsSync(servicesDir)) {
    mkdirSync(servicesDir, { recursive: true });
  }

  const serviceFile = join(
    servicesDir,
    `${entity}.service.${config.fileExtension}`
  );

  const content = config.typescript
    ? generateTypeScriptService(entity, entityCapitalized)
    : generateJavaScriptService(entity, entityCapitalized);

  writeFileSync(serviceFile, content);
};

const generateTypeScriptService = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import {
  ${entity}FindAll,
  ${entity}FindOne,
  ${entity}Create,
  ${entity}Update,
  ${entity}Delete,
} from "../models/${entity}.model";
import type {
  ${entityCapitalized},
  ${entityCapitalized}CreateInput,
  ${entityCapitalized}UpdateInput,
} from "../types/${entity}";

export const getAll${entityCapitalized}s = async (): Promise<${entityCapitalized}[]> => {
  return ${entity}FindAll();
};

export const get${entityCapitalized} = async (id: number): Promise<${entityCapitalized} | null> => {
  return ${entity}FindOne(id);
};

export const create${entityCapitalized} = async (
  data: ${entityCapitalized}CreateInput
): Promise<${entityCapitalized}> => {
  return ${entity}Create(data);
};

export const update${entityCapitalized} = async (
  id: number,
  data: ${entityCapitalized}UpdateInput
): Promise<${entityCapitalized} | null> => {
  return ${entity}Update(id, data);
};

export const delete${entityCapitalized} = async (id: number): Promise<${entityCapitalized} | null> => {
  return ${entity}Delete(id);
};
`;
};

const generateJavaScriptService = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import {
  ${entity}FindAll,
  ${entity}FindOne,
  ${entity}Create,
  ${entity}Update,
  ${entity}Delete,
} from "../models/${entity}.model.js";

export const getAll${entityCapitalized}s = async () => {
  return ${entity}FindAll();
};

export const get${entityCapitalized} = async (id) => {
  return ${entity}FindOne(id);
};

export const create${entityCapitalized} = async (data) => {
  return ${entity}Create(data);
};

export const update${entityCapitalized} = async (id, data) => {
  return ${entity}Update(id, data);
};

export const delete${entityCapitalized} = async (id) => {
  return ${entity}Delete(id);
};
`;
};
