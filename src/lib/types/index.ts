export enum Database {
  SQLite = "sqlite",
  PostgreSQL = "postgresql",
  MySQL = "mysql",
  MongoDB = "mongodb",
  None = "none",
}

export enum PackageManager {
  NPM = "npm",
  YARN = "yarn",
  PNPM = "pnpm",
}

export interface ProjectConfig {
  projectName: string;
  projectPath: string;
  typescript: boolean;
  database: Database;
  template: string;
}

export interface FreshOptions {
  template?: string;
  database?: Database;
  typescript?: boolean;
  packageManager?: PackageManager;
  yes?: boolean;
}
