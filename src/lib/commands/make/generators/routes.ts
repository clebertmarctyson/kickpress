import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const generateRoutes = async (
  workingDir: string,
  entity: string,
  config: ProjectConfig
): Promise<void> => {
  const routesDir = join(workingDir, config.srcDir, "routes");

  if (!existsSync(routesDir)) {
    mkdirSync(routesDir, { recursive: true });
  }

  const routeFile = join(routesDir, `${entity}.routes.${config.fileExtension}`);

  const content = config.typescript
    ? generateTypeScriptRoutes(entity)
    : generateJavaScriptRoutes(entity);

  writeFileSync(routeFile, content);
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateTypeScriptRoutes = (entity: string): string => {
  const entityCapitalized = capitalizeFirst(entity);

  return `import { Router } from "express";
import {
  all,
  findOne,
  create,
  update,
  remove,
} from "../controllers/${entity}.controller";
import {
  validate${entityCapitalized}Create,
  validate${entityCapitalized}Update,
  validate${entityCapitalized}Id,
} from "../validations/${entity}.validation";

const router = Router();

router.route("/")
  .get(all)
  .post(validate${entityCapitalized}Create, create);

router.route("/:id")
  .get(validate${entityCapitalized}Id, findOne)
  .patch(validate${entityCapitalized}Id, validate${entityCapitalized}Update, update)
  .delete(validate${entityCapitalized}Id, remove);

export default router;
`;
};

const generateJavaScriptRoutes = (entity: string): string => {
  const entityCapitalized = capitalizeFirst(entity);

  return `import { Router } from "express";
import {
  all,
  findOne,
  create,
  update,
  remove,
} from "../controllers/${entity}.controller.js";
import {
  validate${entityCapitalized}Create,
  validate${entityCapitalized}Update,
  validate${entityCapitalized}Id,
} from "../validations/${entity}.validation.js";

const router = Router();

router.route("/")
  .get(all)
  .post(validate${entityCapitalized}Create, create);

router.route("/:id")
  .get(validate${entityCapitalized}Id, findOne)
  .patch(validate${entityCapitalized}Id, validate${entityCapitalized}Update, update)
  .delete(validate${entityCapitalized}Id, remove);

export default router;
`;
};
