# DashboardU

DashboardU is a full-stack system monitoring dashboard for managing services, incidents, system health, and operational analytics.

The project was built with React, TypeScript, Vite, Express, and SQLite.

## Features

### System Overview

DashboardU provides a real-time overview of the monitored environment, including:

- Total services
- Online services
- Warning services
- Offline services
- Active incidents
- Average response time
- Average uptime

The dashboard automatically refreshes its data every 10 seconds.

### Service Management

Services can be fully managed directly from the dashboard.

Supported operations:

- Create services
- View service details
- Edit service name
- Edit service status
- Edit response time
- Edit uptime
- Delete services
- Search services
- Filter services by status

When a service is renamed, existing incidents connected to that service are automatically updated.

### Incident Management

DashboardU includes complete incident management.

Supported operations:

- Report incidents
- View incident details
- Edit incidents
- Change affected service
- Change severity
- Resolve incidents
- Delete incidents
- Search incidents
- Filter incidents by severity

Supported severity levels:

- Critical
- High
- Medium
- Low
- Info

### Incident History

Resolved incidents remain available in the incident history.

The history can be:

- Searched
- Filtered
- Inspected through the incident details view

### Analytics

DashboardU includes visual analytics for:

- Service health
- Response times
- Incident severity
- Active vs resolved incidents
- Average uptime
- Average response time
- System availability

### Persistence

Local DashboardU data is stored in SQLite.

The database stores:

- Services
- Incidents
- Incident status
- Resolution timestamps

Data remains available after restarting the application.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Recharts
- CSS

### Backend

- Node.js
- Express
- TypeScript
- SQLite
- CORS

## Project Structure

```text
DashboardU/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── App.css
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   └── index.ts
│   │
│   ├── dashboardu.db
│   └── package.json
│
└── README.md