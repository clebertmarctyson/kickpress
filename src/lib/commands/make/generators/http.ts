import { writeFileSync, mkdirSync, existsSync } from "fs";

import { join } from "path";

export const generateHttpRequests = async (
  workingDir: string,
  entity: string,
  tableName: string,
  routePath: string
): Promise<void> => {
  const requestsDir = join(workingDir, "requests");

  if (!existsSync(requestsDir)) {
    mkdirSync(requestsDir, { recursive: true });
  }

  const httpFile = join(requestsDir, `${entity}.http`);

  const content = `# ${
    entity.charAt(0).toUpperCase() + entity.slice(1)
  } API Requests

@baseUrl = http://localhost:3000
@contentType = application/json

### Get all ${tableName}
GET {{baseUrl}}${routePath}

### Get one ${entity}
GET {{baseUrl}}${routePath}/1

### Create ${entity}
POST {{baseUrl}}${routePath}
Content-Type: {{contentType}}

{
  // "field": "Example"
}

### Update ${entity}
PATCH {{baseUrl}}${routePath}/1
Content-Type: {{contentType}}

{
  // "field": "Example"
}

### Delete ${entity}
DELETE {{baseUrl}}${routePath}/1
`;

  writeFileSync(httpFile, content);
};
