# Contributing to DynamicAI Builder

First off, thank you for considering contributing to DynamicAI Builder! It's people like you that make this project better.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots if applicable**
- **Environment details** (OS, browser, Node version)

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., 18.17.0]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and motivation**
- **Possible implementation approach**
- **Alternatives considered**

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** for your changes
5. **Ensure all tests pass** (`npm test`)
6. **Format code** (`npm run format`)
7. **Commit your changes** (see commit guidelines below)
8. **Push to your fork** (`git push origin feature/amazing-feature`)
9. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/dynamicai-builder.git
cd dynamicai-builder

# Add upstream remote
git remote add upstream https://github.com/original/dynamicai-builder.git

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type when possible
- Use interfaces for object shapes
- Use types for unions and primitives

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Bad
const user: any = { ... };
```

### Code Style

We use Prettier for code formatting. Run before committing:

```bash
npm run format
```

**Key conventions:**
- 2 spaces for indentation
- Semicolons required
- Double quotes for strings
- Trailing commas in objects/arrays

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `ProjectCard.tsx`)
- Services: `kebab-case.service.ts` (e.g., `dynamic-form.service.ts`)
- Repositories: `kebab-case.repository.ts`
- Utils: `kebab-case.ts`

**Variables:**
- camelCase for variables and functions
- PascalCase for classes and components
- UPPER_SNAKE_CASE for constants

```typescript
// ✅ Good
const userName = "John";
const MAX_RETRY_COUNT = 3;
class ProjectService { }

// ❌ Bad
const UserName = "John";
const max_retry_count = 3;
class projectService { }
```

### Component Guidelines

```typescript
// ✅ Good
interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div>
      <h3>{project.name}</h3>
      {onDelete && (
        <button onClick={() => onDelete(project.id)}>
          Delete
        </button>
      )}
    </div>
  );
}

// ❌ Bad - No types, unclear props
export function ProjectCard(props: any) {
  return <div>{props.project.name}</div>;
}
```

### API Route Guidelines

```typescript
// ✅ Good
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await service.getData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return errorHandler(error);
  }
}

// ❌ Bad - No error handling
export async function GET(req: NextRequest) {
  const data = await service.getData();
  return NextResponse.json(data);
}
```

## Testing Requirements

All new features must include tests:

- **Unit tests** for services and utilities
- **Integration tests** for API routes
- **Component tests** for React components

```typescript
// Example test
describe("ProjectService", () => {
  it("should create project", async () => {
    const data = { name: "Test" };
    const result = await projectService.create(data);
    
    expect(result).toBeDefined();
    expect(result.name).toBe(data.name);
  });
});
```

Run tests before submitting:

```bash
npm test
npm run test:coverage
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Good commits
feat(forms): add dynamic validation support
fix(api): handle null values in configuration
docs(readme): update deployment instructions
test(services): add tests for workflow service

# Bad commits
update stuff
fixed bug
changes
```

## Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring

Examples:
- `feature/add-dashboard-widgets`
- `fix/authentication-redirect`
- `docs/update-api-documentation`

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure CI passes** (all tests, linting)
4. **Update CHANGELOG.md** with your changes
5. **Request review** from maintainers
6. **Address feedback** promptly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Code Review Process

Maintainers will review your PR and may:
- Request changes
- Ask questions
- Suggest improvements
- Approve and merge

**Be patient and respectful** during the review process.

## Community

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs and request features
- **Pull Requests**: Submit code contributions
- **Discord**: Join our community server (link TBD)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

## Questions?

Feel free to ask questions by:
- Opening a GitHub Discussion
- Joining our Discord server
- Emailing: contribute@dynamicai.com

Thank you for contributing! 🎉
