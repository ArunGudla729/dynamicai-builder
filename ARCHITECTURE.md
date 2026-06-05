# Architecture Documentation

## Overview

DynamicAI Builder follows **Clean Architecture** principles with clear separation of concerns and dependency inversion.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│   (Next.js App Router, React Components)│
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          API Layer                      │
│   (Next.js API Routes, Middleware)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Service Layer                   │
│   (Business Logic, Orchestration)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Repository Layer                 │
│   (Data Access, Prisma Queries)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Database Layer                  │
│        (PostgreSQL)                     │
└─────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Presentation Layer

**Location**: `src/app/`, `src/components/`

**Responsibilities**:
- UI rendering
- User interactions
- Client-side state management
- Form handling
- Navigation

**Technologies**:
- Next.js 15 (App Router)
- React 19
- TailwindCSS
- ShadCN UI

### 2. API Layer

**Location**: `src/app/api/`, `src/middleware/`

**Responsibilities**:
- HTTP request/response handling
- Authentication & authorization
- Input validation
- Error handling
- Rate limiting
- Audit logging

**Components**:
- Route handlers
- Auth middleware
- Validation middleware
- Error handler
- Rate limiter

### 3. Service Layer

**Location**: `src/services/`

**Responsibilities**:
- Business logic implementation
- Data transformation
- Workflow orchestration
- Third-party integrations
- Complex operations

**Services**:
- `dynamic-form.service.ts` - Form generation & handling
- `dynamic-table.service.ts` - Table generation & querying
- `workflow.service.ts` - Workflow execution
- `csv-import.service.ts` - CSV processing
- `notification.service.ts` - Notification management
- `audit-log.service.ts` - Audit log management

### 4. Repository Layer

**Location**: `src/repositories/`

**Responsibilities**:
- Database queries
- Data persistence
- Query optimization
- Transaction management

**Repositories**:
- `project.repository.ts`
- `configuration.repository.ts`
- `entity.repository.ts`

### 5. Database Layer

**Location**: `prisma/`

**Responsibilities**:
- Data storage
- Data integrity
- Relationships
- Migrations

## Data Flow

### Read Operation

```
User Request
    ↓
API Route Handler
    ↓
Auth Middleware
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Prisma ORM
    ↓
PostgreSQL
    ↓
← Response flows back up
```

### Write Operation

```
User Request (with data)
    ↓
API Route Handler
    ↓
Auth Middleware
    ↓
Validation Middleware
    ↓
Service Layer (business logic)
    ↓
Repository Layer (data access)
    ↓
Prisma ORM
    ↓
PostgreSQL
    ↓
Audit Log Service (async)
    ↓
Workflow Engine (if applicable)
    ↓
← Response flows back up
```

## Design Patterns

### 1. Repository Pattern

**Purpose**: Abstract data access layer

**Benefits**:
- Testability
- Flexibility to change data sources
- Centralized data access logic

**Example**:

```typescript
// Repository
class ProjectRepository {
  async findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  }
}

// Service uses repository
class ProjectService {
  async getProject(id: string) {
    return this.projectRepo.findById(id);
  }
}
```

### 2. Service Layer Pattern

**Purpose**: Encapsulate business logic

**Benefits**:
- Reusable business logic
- Testable units
- Clear separation from data access

### 3. DTO Pattern

**Purpose**: Transfer data between layers

**Benefits**:
- Type safety
- Data validation
- Clear contracts

### 4. Middleware Pattern

**Purpose**: Cross-cutting concerns

**Benefits**:
- Reusable auth/validation logic
- Clean separation of concerns
- Easy to test

## Security Architecture

### Authentication Flow

```
1. User provides credentials
2. API verifies credentials
3. NextAuth creates session
4. JWT token issued
5. Token stored in cookie
6. Subsequent requests include token
7. Middleware verifies token
8. User data loaded from database
```

### Authorization Flow

```
1. Request includes JWT token
2. Middleware extracts user from token
3. Load user's role and permissions
4. Check permission for resource+action
5. Allow or deny request
```

### Security Layers

1. **Input Validation** (Zod schemas)
2. **Sanitization** (XSS prevention)
3. **Rate Limiting** (DDoS protection)
4. **CSRF Protection** (Next.js built-in)
5. **SQL Injection** (Prisma ORM)
6. **Authentication** (NextAuth)
7. **Authorization** (RBAC)

## Scalability Considerations

### Horizontal Scaling

- Stateless API design
- JWT-based authentication
- Database connection pooling
- CDN for static assets

### Vertical Scaling

- Efficient queries with Prisma
- Database indexing
- Caching strategies
- Query optimization

### Performance Optimizations

1. **Database**:
   - Indexes on frequently queried fields
   - Connection pooling
   - Query batching

2. **API**:
   - Response caching
   - Pagination
   - Field selection

3. **Frontend**:
   - Code splitting
   - Image optimization
   - Static generation
   - Incremental static regeneration

## Error Handling Strategy

### Error Hierarchy

```
AppError (base)
├── ValidationError (400)
├── AuthenticationError (401)
├── AuthorizationError (403)
└── NotFoundError (404)
```

### Error Flow

```
1. Error thrown in service/repository
2. Caught by API route handler
3. Passed to error handler middleware
4. Logged appropriately
5. Transformed to API response
6. Audit log created (if needed)
```

## Testing Strategy

### Unit Tests

- Services (business logic)
- Repositories (data access)
- Utilities (helper functions)

### Integration Tests

- API routes
- Database operations
- Authentication flow

### E2E Tests

- User workflows
- Form submissions
- CRUD operations

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────┐
│           Vercel Edge Network           │
│         (CDN + Edge Functions)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Next.js Application            │
│       (Serverless Functions)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Neon PostgreSQL                  │
│    (Managed Database with Pooling)     │
└─────────────────────────────────────────┘
```

### High Availability

- Multiple edge locations (Vercel)
- Database replication (Neon)
- Automatic failover
- Health checks

## Monitoring & Observability

### Logging Levels

1. **Error** - Application errors
2. **Warn** - Potential issues
3. **Info** - Important events
4. **Debug** - Detailed information

### Audit Logging

Track all important actions:
- User authentication
- Data creation/modification
- Permission changes
- Configuration updates

### Metrics

- API response times
- Error rates
- Database query performance
- User activity

## Database Schema Design

### Core Entities

- **Users** - Authentication & user data
- **Roles** - User roles
- **Permissions** - Access control
- **Projects** - User projects
- **Configurations** - JSON configurations
- **Entities** - Dynamic entities
- **Records** - Dynamic data
- **Workflows** - Automation workflows
- **Notifications** - User notifications
- **AuditLogs** - Activity tracking

### Relationships

```
User 1──n Projects
Project 1──n Configurations
Configuration 1──n Entities
Entity 1──n Records
User 1──n Notifications
User 1──n AuditLogs
Role 1──n Users
Role n──n Permissions
```

## Future Enhancements

### Phase 2
- GraphQL API support
- Real-time collaboration (WebSockets)
- Advanced caching (Redis)

### Phase 3
- Microservices architecture
- Message queue (RabbitMQ)
- Event sourcing

### Phase 4
- Mobile apps (React Native)
- Desktop apps (Electron)
- Plugin system

---

This architecture is designed to be:
- ✅ Scalable
- ✅ Maintainable
- ✅ Testable
- ✅ Secure
- ✅ Performant
