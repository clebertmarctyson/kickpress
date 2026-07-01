import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const injectRouteIntoIndex = async (
  workingDir: string,
  entity: string,
  routePath: string,
  config: ProjectConfig
): Promise<void> => {
  const barrelPath = join(
    workingDir,
    config.srcDir,
    "routes",
    `index.${config.fileExtension}`
  );

  let content = readFileSync(barrelPath, "utf-8");

  const importStatement = config.typescript
    ? `import ${entity}Routes from "@/modules/${entity}/${entity}.routes";`
    : `import ${entity}Routes from "../modules/${entity}/${entity}.routes.js";`;
  const routeStatement = `router.use("${routePath}", ${entity}Routes);`;

  if (content.includes(importStatement)) {
    console.log(
      `⚠️  Route for ${entity} already exists in routes barrel, skipping...`
    );
    return;
  }

  // Inject import — after last route import, or before `const router`
  const importRegex = /import\s+\w+Routes\s+from\s+["'][^"']+["'];?/g;
  const importMatches = content.match(importRegex);

  let updatedContent: string;

  if (importMatches && importMatches.length > 0) {
    const lastImport = importMatches[importMatches.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;

    updatedContent =
      content.slice(0, insertPosition) +
      "\n" +
      importStatement +
      content.slice(insertPosition);
  } else {
    // No route imports yet — insert before `const router`
    updatedContent = content.replace(
      /const router = Router\(\);/,
      `${importStatement}\n\nconst router = Router();`
    );
  }

  // Inject registration — after last `router.use`, or before `export default router`
  const routeUsageRegex = /router\.use\(["'][^"']+["'],\s*\w+Routes\);?/g;
  const routeMatches = updatedContent.match(routeUsageRegex);

  if (routeMatches && routeMatches.length > 0) {
    const lastRoute = routeMatches[routeMatches.length - 1];
    const lastRouteIndex = updatedContent.lastIndexOf(lastRoute);
    const insertPosition = lastRouteIndex + lastRoute.length;

    updatedContent =
      updatedContent.slice(0, insertPosition) +
      "\n" +
      routeStatement +
      updatedContent.slice(insertPosition);
  } else {
    // No registrations yet — insert before `export default router`
    updatedContent = updatedContent.replace(
      /export default router;/,
      `${routeStatement}\n\nexport default router;`
    );
  }

  writeFileSync(barrelPath, updatedContent);
};
