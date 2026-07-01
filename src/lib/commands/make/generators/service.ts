import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";
import { formatCode } from "@/lib/utils/format.js";

export const generateService = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  const entityDir = join(workingDir, config.srcDir, "modules", entity);

  if (!existsSync(entityDir)) {
    mkdirSync(entityDir, { recursive: true });
  }

  const serviceFile = join(
    entityDir,
    `${entity}.service.${config.fileExtension}`
  );

  const content = config.typescript
    ? generateTypeScriptService(entity, entityCapitalized)
    : generateJavaScriptService(entity, entityCapitalized);

  writeFileSync(serviceFile, await formatCode(content, serviceFile));
};

const generateTypeScriptService = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import { ${entityCapitalized}Model } from "./${entity}.model";
import type {
  ${entityCapitalized},
  ${entityCapitalized}CreateInput,
  ${entityCapitalized}UpdateInput,
} from "./${entity}.types";

export class ${entityCapitalized}Service {
  constructor(private model: ${entityCapitalized}Model) {}

  async getAll(): Promise<${entityCapitalized}[]> {
    return this.model.findAll();
  }

  async getOne(id: number): Promise<${entityCapitalized} | null> {
    return this.model.findOne(id);
  }

  async create(data: ${entityCapitalized}CreateInput): Promise<${entityCapitalized}> {
    return this.model.create(data);
  }

  async update(id: number, data: ${entityCapitalized}UpdateInput): Promise<${entityCapitalized} | null> {
    return this.model.update(id, data);
  }

  async delete(id: number): Promise<${entityCapitalized} | null> {
    return this.model.delete(id);
  }
}
`;
};

const generateJavaScriptService = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import { ${entityCapitalized}Model } from "./${entity}.model.js";

export class ${entityCapitalized}Service {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    return this.model.findAll();
  }

  async getOne(id) {
    return this.model.findOne(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    return this.model.update(id, data);
  }

  async delete(id) {
    return this.model.delete(id);
  }
}
`;
};
