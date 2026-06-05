"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Code, Database, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const docSections = [
  {
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics and set up your first project",
    content: `
# Getting Started with DynamicAI Builder

## Quick Start

1. **Create a Project**
   - Go to Projects section
   - Click "New Project"
   - Enter project name and description

2. **Create a Configuration**
   - Open your project
   - Click "New Configuration"
   - Choose type: Form, Table, Dashboard, or Workflow
   - Use "Load Example" for quick start

3. **Use Your Configuration**
   - Forms automatically render with all fields
   - Tables display your data with search/filter
   - Dashboards show widgets and charts
   - Workflows automate tasks

## Configuration Types

### Forms
Create dynamic forms from JSON. Supports all field types including text, email, select, checkbox, date, etc.

### Tables
Display data in tables with pagination, search, sort, and export capabilities.

### Dashboards
Build visual dashboards with KPIs, charts, and metrics.

### Workflows
Automate tasks based on events with actions and conditions.
    `,
  },
  {
    title: "Dynamic Forms",
    icon: FileText,
    description: "Create dynamic forms from JSON configuration",
    content: `
# Dynamic Forms

## Form Configuration Structure

\`\`\`json
{
  "entity": "employees",
  "displayName": "Employee Management",
  "fields": [
    {
      "name": "firstName",
      "type": "text",
      "label": "First Name",
      "required": true
    },
    {
      "name": "email",
      "type": "email",
      "label": "Email",
      "required": true
    }
  ]
}
\`\`\`

## Supported Field Types

- **text** - Single line text input
- **email** - Email with validation
- **password** - Password input (hidden)
- **number** - Numeric input
- **date** - Date picker
- **datetime** - Date and time picker
- **textarea** - Multi-line text
- **select** - Dropdown selection
- **multiselect** - Multiple selection
- **checkbox** - Boolean checkbox
- **radio** - Radio buttons
- **switch** - Toggle switch
- **file** - File upload
- **url** - URL with validation
- **tel** - Phone number
- **color** - Color picker
- **range** - Slider input

## Field Properties

- \`name\` (required) - Unique field identifier
- \`type\` (required) - Field type from above list
- \`label\` - Display label
- \`placeholder\` - Placeholder text
- \`required\` - Whether field is required
- \`defaultValue\` - Default value
- \`description\` - Help text below field
- \`options\` - Array of options for select/radio (format: {label, value})
- \`validation\` - Custom validation rules

## Example: Complete Employee Form

See EXAMPLE_CONFIGS.md for full working examples.
    `,
  },
  {
    title: "Dynamic Tables",
    icon: Database,
    description: "Generate data tables with search, sort, and export",
    content: `
# Dynamic Tables

## Table Configuration Structure

\`\`\`json
{
  "entity": "employees",
  "columns": [
    {
      "key": "name",
      "label": "Name",
      "sortable": true,
      "filterable": true
    },
    {
      "key": "email",
      "label": "Email",
      "type": "email"
    }
  ],
  "searchable": true,
  "sortable": true,
  "pagination": {
    "pageSize": 10,
    "pageSizeOptions": [5, 10, 20, 50]
  },
  "exportable": true
}
\`\`\`

## Column Properties

- \`key\` (required) - Data field key
- \`label\` (required) - Column header
- \`type\` - Data type (text, number, email, date, boolean)
- \`sortable\` - Enable sorting
- \`filterable\` - Enable filtering
- \`hidden\` - Hide column
- \`width\` - Column width (px or %)
- \`render\` - Custom render function

## Table Features

### Search
Enable \`searchable: true\` to add global search across all columns.

### Sorting
Enable \`sortable: true\` globally or per column with \`sortable: true\` on column.

### Filtering
Enable \`filterable: true\` on specific columns to add column filters.

### Pagination
Configure page size and options for better UX with large datasets.

### Export
Enable \`exportable: true\` to add CSV export functionality.
    `,
  },
  {
    title: "API Reference",
    icon: Code,
    description: "Complete API documentation and examples",
    content: `
# API Reference

## Authentication

All API endpoints require authentication via NextAuth session.

### Login
POST /api/auth/signin
Body: { email, password }

## Projects API

### List Projects
GET /api/projects
Returns: Array of projects with configuration counts

### Get Project
GET /api/projects/:id
Returns: Project details with all configurations

### Create Project
POST /api/projects
Body: { name, description, isPublic }

### Update Project
PATCH /api/projects/:id
Body: { name, description, isPublic }

### Delete Project
DELETE /api/projects/:id

## Configurations API

### List Configurations
GET /api/configurations
Returns: All configurations across projects

### Get Configuration
GET /api/configurations/:id
Returns: Single configuration with details

### Create Configuration
POST /api/configurations
Body: {
  projectId,
  name,
  type: "form" | "table" | "dashboard" | "workflow",
  config: { ... }
}

### Update Configuration
PATCH /api/configurations/:id
Body: { name, config, isActive }

### Delete Configuration
DELETE /api/configurations/:id

## Records API

### List Records
GET /api/entities/:entityId/records
Query: page, pageSize, search, sort

### Create Record
POST /api/entities/:entityId/records
Body: { data: { field1: value1, ... } }

### Update Record
PUT /api/records/:id
Body: { data: { field1: value1, ... } }

### Delete Record
DELETE /api/records/:id

## Response Format

### Success
\`\`\`json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
\`\`\`

### Error
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]
}
\`\`\`
    `,
  },
];

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [activeDoc, setActiveDoc] = useState(docSections[0]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Documentation</h2>
        <p className="text-muted-foreground">
          Everything you need to know about DynamicAI Builder
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {docSections.map((section, index) => (
                  <button
                    key={section.title}
                    onClick={() => {
                      setSelectedSection(index);
                      setActiveDoc(section);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between ${
                      selectedSection === index ? "bg-muted font-medium" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="h-4 w-4" />
                      <span className="text-sm">{section.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/projects"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-3 w-3" />
                View Projects
              </Link>
              <Link
                href="/dashboard/projects/new"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-3 w-3" />
                Create Project
              </Link>
              <a
                href="https://github.com/yourusername/dynamicai-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                GitHub Repository
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <activeDoc.icon className="h-6 w-6" />
                <div>
                  <CardTitle>{activeDoc.title}</CardTitle>
                  <CardDescription>{activeDoc.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {activeDoc.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Example Configurations</CardTitle>
          <CardDescription>
            Ready-to-use configuration examples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Employee Management System</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Complete example with form, table, dashboard, and workflow configurations
              </p>
              <div className="flex gap-2">
                <Link href="/dashboard/projects/new">
                  <Button size="sm">
                    Try Example
                  </Button>
                </Link>
                <Button size="sm" variant="outline" disabled>
                  <Code className="h-4 w-4 mr-2" />
                  View Code
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sales Lead Tracker</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Track and manage sales leads with custom fields and workflows
              </p>
              <div className="flex gap-2">
                <Link href="/dashboard/projects/new">
                  <Button size="sm">
                    Try Example
                  </Button>
                </Link>
                <Button size="sm" variant="outline" disabled>
                  <Code className="h-4 w-4 mr-2" />
                  View Code
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
