import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ProjectConfig } from "@/lib/commands/make/detect.js";

export const injectRouteIntoIndex = async (
  workingDir: string,
  entity: string,
  routePath: string,
  config: ProjectConfig
): Promise<void> => {
  const indexPath = join(
    workingDir,
    config.srcDir,
    `index.${config.fileExtension}`
  );

  let content = readFileSync(indexPath, "utf-8");

  const importExt = config.typescript ? "" : ".js";
  const importStatement = `import ${entity}Routes from "./routes/${entity}.routes${importExt}";`;
  const routeStatement = `app.use("${routePath}", ${entity}Routes);`;

  // Check if route already exists
  if (content.includes(importStatement)) {
    console.log(
      `⚠️  Route for ${entity} already exists in index file, skipping...`
    );
    return;
  }

  // Find where to inject import (after other route imports or after express import)
  const importRegex = /import\s+\w+Routes\s+from\s+["']\.\/routes\/.+["'];?/g;
  const importMatches = content.match(importRegex);

  let updatedContent: string;

  if (importMatches && importMatches.length > 0) {
    // Add after last route import
    const lastImport = importMatches[importMatches.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const insertPosition = lastImportIndex + lastImport.length;

    updatedContent =
      content.slice(0, insertPosition) +
      "\n" +
      importStatement +
      content.slice(insertPosition);
  } else {
    // Add after express imports, look for "// Import Routes" comment
    const routesCommentRegex = /\/\/\s*Import Routes/;

    if (routesCommentRegex.test(content)) {
      updatedContent = content.replace(
        routesCommentRegex,
        `// Import Routes\n${importStatement}`
      );
    } else {
      // Add after express import as fallback
      const expressImportRegex = /import express[^;]+;/;
      updatedContent = content.replace(
        expressImportRegex,
        (match) => `${match}\n\n// Import Routes\n${importStatement}`
      );
    }
  }

  // Find where to inject route usage (before the default "/" route or after other routes)
  const routeUsageRegex = /app\.use\(["'][^"']+["'],\s*\w+Routes\);?/g;
  const routeMatches = updatedContent.match(routeUsageRegex);

  if (routeMatches && routeMatches.length > 0) {
    // Add after last route usage
    const lastRoute = routeMatches[routeMatches.length - 1];
    const lastRouteIndex = updatedContent.lastIndexOf(lastRoute);
    const insertPosition = lastRouteIndex + lastRoute.length;

    updatedContent =
      updatedContent.slice(0, insertPosition) +
      "\n" +
      routeStatement +
      updatedContent.slice(insertPosition);
  } else {
    // Inject after existing "// Routes" comment if present (reuse it, no duplicate)
    const routesCommentRegex = /\/\/\s*Routes\n/;
    if (routesCommentRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        routesCommentRegex,
        `// Routes\n${routeStatement}\n\n`
      );
    } else {
      // Fallback: add before "// Error Handler"
      const errorHandlerRegex = /\/\/\s*Error Handler/;
      updatedContent = updatedContent.replace(
        errorHandlerRegex,
        `// Routes\n${routeStatement}\n\n// Error Handler`
      );
    }
  }

  writeFileSync(indexPath, updatedContent);
};
