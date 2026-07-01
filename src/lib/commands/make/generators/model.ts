import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";
import { Database } from "@/lib/types/index.js";
import { formatCode } from "@/lib/utils/format.js";

export const generateModel = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  const entityDir = join(workingDir, config.srcDir, "modules", entity);

  if (!existsSync(entityDir)) {
    mkdirSync(entityDir, { recursive: true });
  }

  const modelFile = join(entityDir, `${entity}.model.${config.fileExtension}`);

  const isMongo = config.database === Database.MongoDB;

  const content = config.typescript
    ? generateTypeScriptModel(entity, entityCapitalized, isMongo)
    : generateJavaScriptModel(entity, entityCapitalized, isMongo);

  writeFileSync(modelFile, await formatCode(content, modelFile));
};

const generateTypeScriptModel = (
  entity: string,
  entityCapitalized: string,
  isMongo: boolean,
): string => {
  const idType = isMongo ? "string" : "number";

  return `import type PrismaClientInstance from "@/lib/prisma";
import type {
  ${entityCapitalized},
  ${entityCapitalized}CreateInput,
  ${entityCapitalized}UpdateInput,
} from "./${entity}.types";

export class ${entityCapitalized}Model {
  constructor(private prisma: typeof PrismaClientInstance) {}

  async findAll(): Promise<${entityCapitalized}[]> {
    return this.prisma.${entity}.findMany();
  }

  async findOne(id: ${idType}): Promise<${entityCapitalized} | null> {
    return this.prisma.${entity}.findUnique({
      where: { id },
    });
  }

  async create(data: ${entityCapitalized}CreateInput): Promise<${entityCapitalized}> {
    return this.prisma.${entity}.create({
      data,
    });
  }

  async update(id: ${idType}, data: ${entityCapitalized}UpdateInput): Promise<${entityCapitalized} | null> {
    return this.prisma.${entity}.update({
      where: { id },
      data,
    });
  }

  async delete(id: ${idType}): Promise<${entityCapitalized} | null> {
    return this.prisma.${entity}.delete({
      where: { id },
    });
  }
}
`;
};

const generateJavaScriptModel = (entity: string, entityCapitalized: string, _isMongo: boolean): string => {
  return `export class ${entityCapitalized}Model {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return this.prisma.${entity}.findMany();
  }

  async findOne(id) {
    return this.prisma.${entity}.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return this.prisma.${entity}.create({
      data,
    });
  }

  async update(id, data) {
    return this.prisma.${entity}.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return this.prisma.${entity}.delete({
      where: { id },
    });
  }
}
`;
};
