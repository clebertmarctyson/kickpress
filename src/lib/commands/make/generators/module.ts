import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const generateModule = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  const entityDir = join(workingDir, config.srcDir, entity);

  if (!existsSync(entityDir)) {
    mkdirSync(entityDir, { recursive: true });
  }

  const moduleFile = join(entityDir, `${entity}.module.${config.fileExtension}`);

  const content = config.typescript
    ? generateTypeScriptModule(entity, entityCapitalized)
    : generateJavaScriptModule(entity, entityCapitalized);

  writeFileSync(moduleFile, content);
};

const generateTypeScriptModule = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import { Router } from "express";
import { ${entityCapitalized}Model } from "./${entity}.model";
import { ${entityCapitalized}Service } from "./${entity}.service";
import { ${entityCapitalized}Controller } from "./${entity}.controller";
import {
  validate${entityCapitalized}Create,
  validate${entityCapitalized}Update,
  validate${entityCapitalized}Id,
} from "./${entity}.validation";

const model = new ${entityCapitalized}Model();
const service = new ${entityCapitalized}Service(model);
const controller = new ${entityCapitalized}Controller(service);

const router = Router();

router.route("/")
  .get(controller.all)
  .post(validate${entityCapitalized}Create, controller.create);

router.route("/:id")
  .get(validate${entityCapitalized}Id, controller.findOne)
  .patch(validate${entityCapitalized}Id, validate${entityCapitalized}Update, controller.update)
  .delete(validate${entityCapitalized}Id, controller.remove);

export default router;
`;
};

const generateJavaScriptModule = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import { Router } from "express";
import { ${entityCapitalized}Model } from "./${entity}.model.js";
import { ${entityCapitalized}Service } from "./${entity}.service.js";
import { ${entityCapitalized}Controller } from "./${entity}.controller.js";
import {
  validate${entityCapitalized}Create,
  validate${entityCapitalized}Update,
  validate${entityCapitalized}Id,
} from "./${entity}.validation.js";

const model = new ${entityCapitalized}Model();
const service = new ${entityCapitalized}Service(model);
const controller = new ${entityCapitalized}Controller(service);

const router = Router();

router.route("/")
  .get(controller.all)
  .post(validate${entityCapitalized}Create, controller.create);

router.route("/:id")
  .get(validate${entityCapitalized}Id, controller.findOne)
  .patch(validate${entityCapitalized}Id, validate${entityCapitalized}Update, controller.update)
  .delete(validate${entityCapitalized}Id, controller.remove);

export default router;
`;
};
