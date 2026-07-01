export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const deriveTableNameFromRoute = (routePath: string): string => {
  const segments = routePath
    .split("/")
    .filter((segment) => segment && !segment.startsWith(":"));

  const lastSegment = segments[segments.length - 1] ?? "";

  return lastSegment.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
};
