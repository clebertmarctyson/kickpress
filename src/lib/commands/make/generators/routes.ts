import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";
import { formatCode } from "@/lib/utils/format.js";

export const generateRoutes = async (
  workingDir: string,
  entity: string,
  entityCapitalized: string,
  config: ProjectConfig
): Promise<void> => {
  const entityDir = join(workingDir, config.srcDir, "modules", entity);

  if (!existsSync(entityDir)) {
    mkdirSync(entityDir, { recursive: true });
  }

  const routesFile = join(entityDir, `${entity}.routes.${config.fileExtension}`);

  const content = config.typescript
    ? generateTypeScriptRoutes(entity, entityCapitalized)
    : generateJavaScriptRoutes(entity, entityCapitalized);

  writeFileSync(routesFile, await formatCode(content, routesFile));
};

const generateTypeScriptRoutes = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import { Router } from "express";
import prisma from "@/lib/prisma";
import { ${entityCapitalized}Model } from "@/modules/${entity}/${entity}.model";
import { ${entityCapitalized}Service } from "@/modules/${entity}/${entity}.service";
import { ${entityCapitalized}Controller } from "@/modules/${entity}/${entity}.controller";
import {
  validate${entityCapitalized}Create,
  validate${entityCapitalized}Update,
  validate${entityCapitalized}Id,
} from "@/modules/${entity}/${entity}.validation";

const model = new ${entityCapitalized}Model(prisma);
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

const generateJavaScriptRoutes = (
  entity: string,
  entityCapitalized: string
): string => {
  return `import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { ${entityCapitalized}Model } from "./${entity}.model.js";
import { ${entityCapitalized}Service } from "./${entity}.service.js";
import { ${entityCapitalized}Controller } from "./${entity}.controller.js";
import {
  validate${entityCapitalized}Create,
  validate${entityCapitalized}Update,
  validate${entityCapitalized}Id,
} from "./${entity}.validation.js";

const model = new ${entityCapitalized}Model(prisma);
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
