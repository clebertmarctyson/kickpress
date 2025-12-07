import { readFileSync } from "fs";
import { join } from "path";
import type { PackageJson } from "type-fest";
import { getCliRootDirectory } from "@/lib/utils/paths.js";

export const getPackageJson = (): PackageJson => {
  const packageJsonPath = join(
    getCliRootDirectory("package.json"),
    "package.json"
  );
  return JSON.parse(readFileSync(packageJsonPath, "utf-8"));
};
