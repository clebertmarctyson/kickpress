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

const generateTypeScriptRoutes = (entity: string): string => {
  return `import { Router } from "express";
import {
  all,
  findOne,
  create,
  update,
  remove,
} from "../controllers/${entity}.controller";

const router = Router();

router.route("/").get(all).post(create);

router.route("/:id").get(findOne).patch(update).delete(remove);

export default router;
`;
};

const generateJavaScriptRoutes = (entity: string): string => {
  return `import { Router } from "express";
import {
  all,
  findOne,
  create,
  update,
  remove,
} from "../controllers/${entity}.controller.js";

const router = Router();

router.route("/").get(all).post(create);

router.route("/:id").get(findOne).patch(update).delete(remove);

export default router;
`;
};
