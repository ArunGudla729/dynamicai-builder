# API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a valid session token in cookies.

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "metadata": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Projects

### List Projects

```http
GET /api/projects?page=1&pageSize=10
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "name": "My Project",
      "description": "Project description",
      "isPublic": false,
      "userId": "user123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "page": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Project

```http
GET /api/projects/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clx123...",
    "name": "My Project",
    "description": "Project description",
    "isPublic": false,
    "configurations": [...]
  }
}
```

### Create Project

```http
POST /api/projects
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description",
  "isPublic": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clx123...",
    "name": "My Project",
    ...
  },
  "message": "Project created successfully"
}
```

### Update Project

```http
PUT /api/projects/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Project

```http
DELETE /api/projects/:id
```

## Configurations

### Create Configuration

```http
POST /api/configurations
Content-Type: application/json

{
  "projectId": "clx123...",
  "name": "Employee Form",
  "type": "form",
  "config": {
    "entity": "employees",
    "fields": [
      {
        "name": "name",
        "type": "text",
        "required": true
      }
    ]
  }
}
```

**Types:** `form`, `table`, `dashboard`, `workflow`

### Get Configuration

```http
GET /api/configurations/:id
```

### Update Configuration

```http
PUT /api/configurations/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "config": {...}
}
```

### Delete Configuration

```http
DELETE /api/configurations/:id
```

## Entities & Records

### Query Records

```http
GET /api/entities/:entityId/records?page=1&pageSize=10&sortBy=createdAt&sortOrder=desc
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Records per page (default: 10)
- `sortBy` - Field to sort by
- `sortOrder` - `asc` or `desc`
- `search` - Search term

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "record123",
      "entityId": "entity123",
      "data": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Create Record

```http
POST /api/entities/:entityId/records
Content-Type: application/json

{
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "salary": 50000
  }
}
```

### Update Record

```http
PUT /api/records/:id
Content-Type: application/json

{
  "data": {
    "name": "Jane Doe",
    "salary": 55000
  }
}
```

### Delete Record

```http
DELETE /api/records/:id
```

### Export to CSV

```http
GET /api/entities/:entityId/export
```

**Response:** CSV file download

## Workflows

### List Workflows

```http
GET /api/workflows?page=1&pageSize=10
```

### Create Workflow

```http
POST /api/workflows
Content-Type: application/json

{
  "name": "Employee Welcome",
  "description": "Send welcome email to new employees",
  "config": {
    "event": "employee_created",
    "actions": [
      {
        "type": "send_email",
        "config": {
          "to": "{{email}}",
          "subject": "Welcome!",
          "template": "welcome"
        }
      },
      {
        "type": "create_notification",
        "config": {
          "type": "info",
          "title": "New Employee",
          "message": "Welcome {{name}}"
        }
      }
    ]
  }
}
```

### Trigger Workflow

```http
POST /api/workflows/trigger
Content-Type: application/json

{
  "event": "employee_created",
  "payload": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get Workflow Executions

```http
GET /api/workflows/:id/executions
```

## Notifications

### Get User Notifications

```http
GET /api/notifications?unreadOnly=false&limit=50
```

### Mark as Read

```http
PUT /api/notifications/:id/read
```

### Mark All as Read

```http
PUT /api/notifications/read-all
```

### Delete Notification

```http
DELETE /api/notifications/:id
```

### Get Unread Count

```http
GET /api/notifications/unread-count
```

## CSV Import

### Import CSV

```http
POST /api/entities/:entityId/import
Content-Type: multipart/form-data

file: [CSV file]
skipFirstRow: true
mappings: {"CSV Column": "entity_field"}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "imported": 95,
    "failed": 5,
    "errors": [
      {
        "row": 3,
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Validate CSV

```http
POST /api/entities/:entityId/validate-csv
Content-Type: multipart/form-data

file: [CSV file]
```

## Audit Logs

### Query Audit Logs

```http
GET /api/audit-logs?userId=user123&action=create&resource=project&page=1
```

**Query Parameters:**
- `userId` - Filter by user
- `action` - Filter by action
- `resource` - Filter by resource type
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `page` - Page number
- `pageSize` - Records per page

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| AUTHENTICATION_ERROR | 401 | Not authenticated |
| AUTHORIZATION_ERROR | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMIT_ERROR | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Internal server error |

## Rate Limiting

- **Default**: 100 requests per 15 minutes
- **Per IP address**
- Returns `429 Too Many Requests` when exceeded

**Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Pagination

All list endpoints support pagination:

```
?page=1&pageSize=10
```

**Response includes metadata:**

```json
{
  "metadata": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Filtering & Sorting

### Filtering

```http
GET /api/records?filters[department]=engineering&filters[active]=true
```

### Sorting

```http
GET /api/records?sortBy=createdAt&sortOrder=desc
```

## Search

```http
GET /api/records?search=john
```

## Field Selection

```http
GET /api/projects?fields=id,name,createdAt
```

## Webhook Events

Configure webhooks to receive events:

### Available Events

- `project.created`
- `project.updated`
- `project.deleted`
- `configuration.created`
- `configuration.updated`
- `record.created`
- `record.updated`
- `record.deleted`
- `workflow.executed`

### Webhook Payload

```json
{
  "event": "record.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "record123",
    "entityId": "entity123",
    "data": {...}
  }
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
const client = new DynamicAIClient({
  baseUrl: "http://localhost:3000/api",
  apiKey: "your-api-key"
});

// Create project
const project = await client.projects.create({
  name: "My Project",
  description: "Test project"
});

// Query records
const records = await client.entities.records.query("entity-id", {
  page: 1,
  pageSize: 10,
  sortBy: "createdAt"
});
```

### Python

```python
from dynamicai import DynamicAIClient

client = DynamicAIClient(
    base_url="http://localhost:3000/api",
    api_key="your-api-key"
)

# Create project
project = client.projects.create(
    name="My Project",
    description="Test project"
)

# Query records
records = client.entities.records.query(
    entity_id="entity-id",
    page=1,
    page_size=10
)
```

## Postman Collection

Import our Postman collection for easy API testing:

[Download Postman Collection](./postman_collection.json)

---

For more examples and detailed documentation, visit our [API Documentation Portal](https://docs.dynamicai.com).
