# Example Configurations for Testing

Use these example configurations to test all features of the DynamicAI Builder application.

## 1. Employee Form Configuration

**Configuration Name:** Employee Form  
**Type:** form

```json
{
  "entity": "employees",
  "displayName": "Employee Management",
  "fields": [
    {
      "name": "firstName",
      "type": "text",
      "label": "First Name",
      "placeholder": "Enter first name",
      "required": true
    },
    {
      "name": "lastName",
      "type": "text",
      "label": "Last Name",
      "placeholder": "Enter last name",
      "required": true
    },
    {
      "name": "email",
      "type": "email",
      "label": "Email Address",
      "placeholder": "employee@example.com",
      "required": true
    },
    {
      "name": "phone",
      "type": "tel",
      "label": "Phone Number",
      "placeholder": "+1 (555) 000-0000"
    },
    {
      "name": "department",
      "type": "select",
      "label": "Department",
      "required": true,
      "options": [
        { "label": "Engineering", "value": "engineering" },
        { "label": "Marketing", "value": "marketing" },
        { "label": "Sales", "value": "sales" },
        { "label": "HR", "value": "hr" },
        { "label": "Finance", "value": "finance" }
      ]
    },
    {
      "name": "position",
      "type": "text",
      "label": "Position",
      "placeholder": "e.g., Senior Developer",
      "required": true
    },
    {
      "name": "salary",
      "type": "number",
      "label": "Salary",
      "placeholder": "50000"
    },
    {
      "name": "startDate",
      "type": "date",
      "label": "Start Date",
      "required": true
    },
    {
      "name": "isActive",
      "type": "checkbox",
      "label": "Active Employee"
    },
    {
      "name": "bio",
      "type": "textarea",
      "label": "Biography",
      "placeholder": "Tell us about this employee..."
    }
  ]
}
```

---

## 2. Employee Table Configuration

**Configuration Name:** Employee Table  
**Type:** table

```json
{
  "entity": "employees",
  "columns": [
    {
      "key": "firstName",
      "label": "First Name",
      "sortable": true,
      "filterable": true
    },
    {
      "key": "lastName",
      "label": "Last Name",
      "sortable": true,
      "filterable": true
    },
    {
      "key": "email",
      "label": "Email",
      "type": "email",
      "sortable": true
    },
    {
      "key": "department",
      "label": "Department",
      "sortable": true,
      "filterable": true
    },
    {
      "key": "position",
      "label": "Position",
      "sortable": true
    },
    {
      "key": "salary",
      "label": "Salary",
      "type": "number",
      "sortable": true
    },
    {
      "key": "startDate",
      "label": "Start Date",
      "type": "date",
      "sortable": true
    },
    {
      "key": "isActive",
      "label": "Status",
      "type": "boolean"
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
```

---

## 3. Analytics Dashboard Configuration

**Configuration Name:** Analytics Dashboard  
**Type:** dashboard

```json
{
  "title": "Employee Analytics Dashboard",
  "widgets": [
    {
      "id": "total-employees",
      "type": "kpi",
      "title": "Total Employees",
      "data": {
        "value": 150,
        "change": "+12%",
        "trend": "up"
      },
      "position": {
        "x": 0,
        "y": 0,
        "w": 3,
        "h": 2
      }
    },
    {
      "id": "active-employees",
      "type": "stat",
      "title": "Active Employees",
      "data": {
        "value": 142,
        "total": 150,
        "percentage": 94.7
      },
      "position": {
        "x": 3,
        "y": 0,
        "w": 3,
        "h": 2
      }
    },
    {
      "id": "avg-salary",
      "type": "metric",
      "title": "Average Salary",
      "data": {
        "value": 75000,
        "currency": "USD",
        "format": "currency"
      },
      "position": {
        "x": 6,
        "y": 0,
        "w": 3,
        "h": 2
      }
    },
    {
      "id": "new-hires",
      "type": "kpi",
      "title": "New Hires (This Month)",
      "data": {
        "value": 8,
        "change": "+3",
        "trend": "up"
      },
      "position": {
        "x": 9,
        "y": 0,
        "w": 3,
        "h": 2
      }
    },
    {
      "id": "dept-distribution",
      "type": "chart",
      "title": "Department Distribution",
      "config": {
        "type": "pie",
        "data": [
          { "name": "Engineering", "value": 45 },
          { "name": "Marketing", "value": 25 },
          { "name": "Sales", "value": 35 },
          { "name": "HR", "value": 15 },
          { "name": "Finance", "value": 30 }
        ]
      },
      "position": {
        "x": 0,
        "y": 2,
        "w": 6,
        "h": 4
      }
    },
    {
      "id": "salary-trends",
      "type": "chart",
      "title": "Monthly Salary Trends",
      "config": {
        "type": "line",
        "xAxisKey": "month",
        "yAxisKey": "avgSalary",
        "data": [
          { "month": "Jan", "avgSalary": 72000 },
          { "month": "Feb", "avgSalary": 73000 },
          { "month": "Mar", "avgSalary": 74000 },
          { "month": "Apr", "avgSalary": 74500 },
          { "month": "May", "avgSalary": 75000 },
          { "month": "Jun", "avgSalary": 75500 }
        ]
      },
      "position": {
        "x": 6,
        "y": 2,
        "w": 6,
        "h": 4
      }
    }
  ],
  "layout": {
    "cols": 12,
    "rowHeight": 60,
    "gap": 16
  }
}
```

---

## 4. Employee Onboarding Workflow Configuration

**Configuration Name:** Employee Onboarding Workflow  
**Type:** workflow

```json
{
  "event": "employee_created",
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to": "hr@company.com",
        "subject": "New Employee Onboarding",
        "template": "onboarding_notification",
        "data": {
          "employeeName": "{{firstName}} {{lastName}}",
          "department": "{{department}}",
          "startDate": "{{startDate}}"
        }
      }
    },
    {
      "type": "create_notification",
      "config": {
        "title": "New Employee Added",
        "message": "{{firstName}} {{lastName}} has been added to {{department}}",
        "priority": "high",
        "recipients": ["hr_manager", "department_head"]
      }
    },
    {
      "type": "webhook",
      "config": {
        "url": "https://api.company.com/webhooks/employee-created",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{api_token}}",
          "Content-Type": "application/json"
        },
        "body": {
          "event": "employee_created",
          "employee": "{{employee_data}}"
        }
      }
    }
  ],
  "conditions": [
    {
      "field": "isActive",
      "operator": "eq",
      "value": true
    }
  ]
}
```

---

## 5. Sales Lead Form Configuration

**Configuration Name:** Sales Lead Form  
**Type:** form

```json
{
  "entity": "sales_leads",
  "displayName": "Sales Lead Management",
  "fields": [
    {
      "name": "companyName",
      "type": "text",
      "label": "Company Name",
      "required": true
    },
    {
      "name": "contactPerson",
      "type": "text",
      "label": "Contact Person",
      "required": true
    },
    {
      "name": "email",
      "type": "email",
      "label": "Email",
      "required": true
    },
    {
      "name": "phone",
      "type": "tel",
      "label": "Phone"
    },
    {
      "name": "leadSource",
      "type": "select",
      "label": "Lead Source",
      "required": true,
      "options": [
        { "label": "Website", "value": "website" },
        { "label": "Referral", "value": "referral" },
        { "label": "Cold Call", "value": "cold_call" },
        { "label": "Trade Show", "value": "trade_show" },
        { "label": "Social Media", "value": "social_media" }
      ]
    },
    {
      "name": "status",
      "type": "select",
      "label": "Status",
      "required": true,
      "options": [
        { "label": "New", "value": "new" },
        { "label": "Contacted", "value": "contacted" },
        { "label": "Qualified", "value": "qualified" },
        { "label": "Proposal Sent", "value": "proposal" },
        { "label": "Closed Won", "value": "won" },
        { "label": "Closed Lost", "value": "lost" }
      ]
    },
    {
      "name": "estimatedValue",
      "type": "number",
      "label": "Estimated Deal Value"
    },
    {
      "name": "notes",
      "type": "textarea",
      "label": "Notes"
    },
    {
      "name": "followUp",
      "type": "date",
      "label": "Follow-up Date"
    }
  ]
}
```

---

## Testing Instructions

1. **Create a Project** first if you haven't already
2. **Test Each Configuration Type:**
   - Copy one configuration JSON at a time
   - Click "Create Configuration" in your project
   - Enter the configuration name
   - Select the type
   - Paste the JSON
   - Click "Create Configuration"

3. **Verify Forms:**
   - After creating a form config, click "View" to see the generated form
   - Fill out the form and submit
   - Verify the data is saved

4. **Verify Tables:**
   - After creating a table config, go to the Tables tab
   - Verify columns are displayed
   - Test search, sort, and pagination (if data exists)

5. **Verify Dashboards:**
   - After creating a dashboard config, go to the Dashboards tab
   - Verify all widgets are displayed
   - Check KPIs, charts, and metrics

6. **Verify Workflows:**
   - After creating a workflow config, go to the Workflows tab
   - Verify the workflow is listed with its trigger event

---

## Admin Credentials

- **Email:** admin@dynamicai.com
- **Password:** admin123

---

## Notes

- All configurations are fully tested and working
- The validation is lenient to accept various JSON structures
- Error messages will guide you if any required fields are missing
- You can modify these configurations to suit your needs
