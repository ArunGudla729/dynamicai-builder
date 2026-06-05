# 🚀 DynamicAI Builder

> **Production-Grade SaaS Application** - A metadata-driven platform that dynamically creates complete applications from JSON configurations.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

## ✨ Features

Transform JSON configurations into fully functional applications:

- 📝 **Dynamic Forms** - Auto-generated forms with validation
- 📊 **Data Tables** - Sortable, filterable tables with pagination
- 📈 **Dashboards** - Real-time dashboards with KPIs and charts
- 🔄 **Workflows** - Event-driven automation
- 🗄️ **Auto APIs** - RESTful APIs generated automatically
- 🎨 **Modern UI** - Professional design with smooth animations

**No additional code required!**

---

## 🎯 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/dynamicai-builder.git
cd dynamicai-builder
npm install
```

### 2. Setup Database
Create `.env.local`:
```env
DATABASE_URL=your_postgresql_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 3. Initialize Database
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default Login:**
- Email: `admin@dynamicai.com`
- Password: `admin123`

---

## 🚀 Deploy to Production

See **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** for complete deployment instructions.

### Quick Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy! ✅

**Estimated Time:** 5 minutes

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 18
- TypeScript
- TailwindCSS + ShadCN UI
- TanStack Query

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth v5

### Infrastructure
- Docker support
- CI/CD with GitHub Actions
- PWA ready

---

## 📚 Documentation

- **[API.md](./API.md)** - Complete API reference
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment options
- **[EXAMPLE_CONFIGS.md](./EXAMPLE_CONFIGS.md)** - Configuration examples
- **[TESTING.md](./TESTING.md)** - Testing guide

---

## 💡 Example Usage

### Create a Form
```json
{
  "entity": "employees",
  "fields": [
    { "name": "name", "type": "text", "required": true },
    { "name": "email", "type": "email", "required": true },
    { "name": "department", "type": "select", "options": [...] }
  ]
}
```

### Create a Table
```json
{
  "entity": "employees",
  "columns": [
    { "key": "name", "label": "Name", "sortable": true },
    { "key": "email", "label": "Email" }
  ],
  "searchable": true,
  "pagination": { "pageSize": 10 }
}
```

See [EXAMPLE_CONFIGS.md](./EXAMPLE_CONFIGS.md) for more examples.

---

## 🏗️ Architecture

Built on **Clean Architecture** principles:

- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic
- **DTO Layer** - Data transfer objects
- **Validation Layer** - Zod validation
- **Middleware Layer** - Auth & error handling

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

## 📞 Contact

- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Email:** your.email@example.com

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
- **Auth.js (NextAuth v5)**
- **Google OAuth**
- **GitHub OAuth**
- **Email/Password**

### Infrastructure
- **Vercel** - Deployment
- **Neon PostgreSQL** - Database hosting
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## 📋 Features

### 1️⃣ Dynamic Form Builder
Upload JSON to generate fully functional forms with:
- ✅ Validation rules
- 🎨 Custom fields
- 📝 CRUD operations
- 🔗 API mapping

### 2️⃣ Dynamic Table Builder
Automatic table generation with:
- 🔍 Search functionality
- 📄 Pagination
- ↕️ Sorting
- 🎯 Filtering
- 👁️ Column visibility
- 📥 CSV Export

### 3️⃣ Dynamic Dashboard Builder
Create dashboards with:
- 📊 KPI Cards
- 📈 Charts (Recharts)
- 📉 Metrics
- 📊 Statistics

### 4️⃣ Dynamic CRUD Engine
Auto-generated REST APIs for:
- ➕ Create
- 👁️ Read
- ✏️ Update
- 🗑️ Delete

### 5️⃣ Workflow Engine
Event-driven workflows:
- 📧 Email notifications
- 🔔 In-app notifications
- 🪝 Webhooks
- 🔄 Custom actions

### 6️⃣ Role-Based Access Control (RBAC)
- 👤 Admin, Manager, User roles
- 🔐 Permission-based access
- 🛡️ Route protection

### 7️⃣ Multi-Authentication
- 🔐 Credentials (Email/Password)
- 🌐 Google OAuth
- 🐙 GitHub OAuth
- 🔑 JWT Session management

### 8️⃣ CSV Import
- 📁 Upload CSV files
- ✅ Validation
- 👀 Preview
- 📥 Bulk import
- ⚠️ Graceful error handling

### 9️⃣ Notifications
- 📬 In-app notifications
- 📧 Email notifications
- 🔔 Notification center

### 🔟 Multi-Language Support
- 🌍 i18next integration
- 🇬🇧 English
- 🇮🇳 Hindi

### 1️⃣1️⃣ Progressive Web App (PWA)
- 📱 Installable
- 🔄 Offline mode
- ⚡ Service workers

### 1️⃣2️⃣ GitHub Export
- 📤 Export JSON configs
- 📋 API definitions
- 🗄️ Schema definitions

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/dynamicai-builder.git
cd dynamicai-builder
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dynamicai"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Setup

### Using Docker Compose

```bash
# Build and start containers
npm run docker:up

# Stop containers
npm run docker:down

# Rebuild containers
npm run docker:build
```

## 📚 Usage Examples

### Example 1: Dynamic Form

```json
{
  "entity": "employees",
  "displayName": "Employee Management",
  "fields": [
    {
      "name": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "validation": [
        { "type": "minLength", "value": 2, "message": "Name too short" }
      ]
    },
    {
      "name": "email",
      "type": "email",
      "required": true
    },
    {
      "name": "salary",
      "type": "number",
      "label": "Annual Salary",
      "validation": [
        { "type": "min", "value": 0 }
      ]
    },
    {
      "name": "department",
      "type": "select",
      "options": [
        { "label": "Engineering", "value": "engineering" },
        { "label": "Sales", "value": "sales" },
        { "label": "HR", "value": "hr" }
      ]
    }
  ]
}
```

### Example 2: Dynamic Table

```json
{
  "entity": "employees",
  "columns": [
    { "key": "name", "label": "Name", "sortable": true },
    { "key": "email", "label": "Email" },
    { "key": "salary", "label": "Salary", "type": "number" },
    { "key": "department", "label": "Department", "filterable": true }
  ],
  "searchable": true,
  "exportable": true,
  "pagination": {
    "pageSize": 10,
    "pageSizeOptions": [10, 25, 50]
  }
}
```

### Example 3: Workflow

```json
{
  "event": "employee_created",
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to": "hr@company.com",
        "subject": "New Employee Added",
        "template": "employee_welcome"
      }
    },
    {
      "type": "create_notification",
      "config": {
        "type": "info",
        "title": "New Employee",
        "message": "A new employee has been added"
      }
    }
  ]
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security Features

- ✅ **Zod Validation** - Type-safe validation
- 🛡️ **Rate Limiting** - Prevent abuse
- 🧹 **Input Sanitization** - XSS protection
- 💉 **SQL Injection Protection** - Prisma ORM
- 🔐 **CSRF Protection** - Built-in
- 🔑 **JWT Sessions** - Secure authentication

## 📊 Observability

- 🐛 **Error Boundaries** - Graceful error handling
- 🌍 **Global Error Handler** - Centralized error management
- 📝 **Logging System** - Comprehensive logging
- 📋 **Audit Logs** - Track all actions

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
dynamicai-builder/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   └── auth/              # Auth pages
│   ├── components/            # React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── forms/            # Dynamic form components
│   │   ├── tables/           # Dynamic table components
│   │   └── charts/           # Chart components
│   ├── services/              # Business logic
│   ├── repositories/          # Data access layer
│   ├── dto/                   # Data transfer objects
│   ├── validations/           # Zod schemas
│   ├── middleware/            # Express-like middleware
│   ├── types/                 # TypeScript types
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── config/                # Configuration files
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Seed data
├── public/                    # Static assets
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml        # Docker configuration
├── Dockerfile                # Container definition
└── README.md                 # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Vercel for hosting
- ShadCN for beautiful UI components

## 📞 Support

For support, email support@dynamicai.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] GraphQL API support
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Mobile apps (React Native)
- [ ] Plugin system
- [ ] API marketplace
- [ ] AI-powered form generation

---

Made with ❤️ by the DynamicAI team
