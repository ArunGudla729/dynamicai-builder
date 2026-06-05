# Testing Guide

## Overview

DynamicAI Builder uses a comprehensive testing strategy covering unit, integration, and end-to-end tests.

## Test Stack

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing
- **Testing Library** - User-centric testing utilities
- **MSW** (Mock Service Worker) - API mocking

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run only unit tests
npm test -- --testPathPattern=unit

# Run only integration tests
npm test -- --testPathPattern=integration
```

## Test Structure

```
src/
├── __tests__/
│   ├── unit/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── utils/
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   └── e2e/
│       ├── auth/
│       ├── projects/
│       └── workflows/
```

## Unit Tests

### Service Tests

**Example: dynamic-form.service.test.ts**

```typescript
import { dynamicFormService } from "@/services/dynamic-form.service";

describe("DynamicFormService", () => {
  describe("generateForm", () => {
    it("should generate form from valid config", async () => {
      const config = {
        entity: "test_entity",
        fields: [
          { name: "name", type: "text", required: true },
        ],
      };

      const result = await dynamicFormService.generateForm(config, "config-id");
      
      expect(result).toHaveProperty("entity");
      expect(result.formConfig.fields).toHaveLength(1);
    });

    it("should throw error for invalid config", async () => {
      const invalidConfig = { entity: "" };

      await expect(
        dynamicFormService.generateForm(invalidConfig as any, "config-id")
      ).rejects.toThrow();
    });
  });
});
```

### Repository Tests

**Example: project.repository.test.ts**

```typescript
import { projectRepository } from "@/repositories/project.repository";
import { prisma } from "@/lib/prisma";

describe("ProjectRepository", () => {
  beforeEach(async () => {
    await prisma.project.deleteMany();
  });

  describe("create", () => {
    it("should create a new project", async () => {
      const data = {
        name: "Test Project",
        description: "Test description",
      };

      const project = await projectRepository.create("user-id", data);

      expect(project).toHaveProperty("id");
      expect(project.name).toBe(data.name);
    });
  });

  describe("findById", () => {
    it("should find project by id", async () => {
      const created = await projectRepository.create("user-id", {
        name: "Test",
      });

      const found = await projectRepository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it("should return null for non-existent id", async () => {
      const found = await projectRepository.findById("non-existent");

      expect(found).toBeNull();
    });
  });
});
```

### Utility Tests

**Example: utils.test.ts**

```typescript
import { slugify, formatCurrency, isValidEmail } from "@/lib/utils";

describe("Utils", () => {
  describe("slugify", () => {
    it("should convert string to slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Test  Multiple   Spaces")).toBe("test-multiple-spaces");
    });
  });

  describe("formatCurrency", () => {
    it("should format number as currency", () => {
      expect(formatCurrency(1000)).toBe("$1,000.00");
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });
  });

  describe("isValidEmail", () => {
    it("should validate email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });
  });
});
```

## Integration Tests

### API Route Tests

**Example: projects.api.test.ts**

```typescript
import { GET, POST } from "@/app/api/projects/route";
import { NextRequest } from "next/server";

jest.mock("@/middleware/auth", () => ({
  requireAuth: jest.fn(() => ({
    user: { id: "user-123" },
  })),
}));

describe("Projects API", () => {
  describe("GET /api/projects", () => {
    it("should return user projects", async () => {
      const req = new NextRequest("http://localhost:3000/api/projects");
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("data");
    });
  });

  describe("POST /api/projects", () => {
    it("should create new project", async () => {
      const req = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({
          name: "Test Project",
          description: "Test",
        }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("Test Project");
    });

    it("should validate required fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
```

## Component Tests

**Example: ProjectCard.test.tsx**

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/project-card";

describe("ProjectCard", () => {
  const mockProject = {
    id: "1",
    name: "Test Project",
    description: "Test description",
    createdAt: new Date(),
  };

  it("should render project information", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("should call onDelete when delete button clicked", () => {
    const onDelete = jest.fn();
    render(<ProjectCard project={mockProject} onDelete={onDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockProject.id);
  });
});
```

## E2E Tests

**Example: auth-flow.e2e.test.ts**

```typescript
describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should allow user to sign in", () => {
    cy.visit("/auth/signin");
    cy.get('input[name="email"]').type("admin@dynamicai.com");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome").should("be.visible");
  });

  it("should show error for invalid credentials", () => {
    cy.visit("/auth/signin");
    cy.get('input[name="email"]').type("wrong@email.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.contains("Invalid credentials").should("be.visible");
  });
});
```

## Test Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| Services | 90% |
| Repositories | 85% |
| API Routes | 85% |
| Components | 80% |
| Utilities | 95% |
| Overall | 80% |

## Mocking Strategies

### Database Mocking

```typescript
jest.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));
```

### API Mocking with MSW

```typescript
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/projects", (req, res, ctx) => {
    return res(ctx.json({ success: true, data: [] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Testing Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it("should create project", async () => {
  // Arrange
  const data = { name: "Test" };

  // Act
  const result = await createProject(data);

  // Assert
  expect(result).toBeDefined();
  expect(result.name).toBe(data.name);
});
```

### 2. Test Isolation

- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Don't rely on test execution order

### 3. Meaningful Test Names

```typescript
// ✅ Good
it("should return 401 when user is not authenticated")

// ❌ Bad
it("test authentication")
```

### 4. Test Edge Cases

- Empty inputs
- Null/undefined values
- Boundary values
- Error conditions

### 5. Avoid Testing Implementation Details

```typescript
// ✅ Good - Test behavior
expect(screen.getByText("Project Name")).toBeInTheDocument();

// ❌ Bad - Test implementation
expect(component.state.isLoading).toBe(false);
```

## Continuous Integration

Tests run automatically on:
- Every pull request
- Every push to main/develop
- Before deployment

See `.github/workflows/ci.yml` for CI configuration.

## Debugging Tests

```bash
# Run specific test file
npm test -- src/__tests__/unit/services/dynamic-form.service.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create"

# Debug in VS Code
# Add breakpoint and run "Jest: Debug"
```

## Performance Testing

```typescript
describe("Performance", () => {
  it("should handle large datasets efficiently", async () => {
    const startTime = Date.now();
    
    const result = await queryLargeDataset();
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(1000); // Should complete in < 1s
  });
});
```

---

For more information, see Jest documentation: https://jestjs.io/
