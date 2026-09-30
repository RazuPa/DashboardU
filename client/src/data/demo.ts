import type {
  Incident,
  Service,
} from "../types/dashboard";

export const demoServices: Service[] = [
  {
    id: 1,
    name: "Public API",
    status: "online",
    responseTime: 84,
    uptime: 99.99,
  },

  {
    id: 2,
    name: "Authentication",
    status: "online",
    responseTime: 112,
    uptime: 99.97,
  },

  {
    id: 3,
    name: "Database",
    status: "warning",
    responseTime: 268,
    uptime: 99.91,
  },

  {
    id: 4,
    name: "Reporting Service",
    status: "online",
    responseTime: 143,
    uptime: 99.95,
  },

  {
    id: 5,
    name: "Notification Worker",
    status: "offline",
    responseTime: 0,
    uptime: 98.72,
  },

  {
    id: 6,
    name: "File Storage",
    status: "online",
    responseTime: 96,
    uptime: 99.98,
  },
];

export const demoIncidents: Incident[] = [
  {
    id: 101,
    service: "Notification Worker",
    title: "Service unavailable",
    severity: "high",
    status: "active",
    timestamp: "2026-09-30T08:42:00.000Z",
    resolvedAt: null,
  },

  {
    id: 102,
    service: "Database",
    title: "Response time above threshold",
    severity: "medium",
    status: "active",
    timestamp: "2026-09-30T09:18:00.000Z",
    resolvedAt: null,
  },

  {
    id: 103,
    service: "Public API",
    title: "Elevated request latency",
    severity: "low",
    status: "active",
    timestamp: "2026-09-30T09:51:00.000Z",
    resolvedAt: null,
  },
];

export const demoIncidentHistory: Incident[] = [
  ...demoIncidents,

  {
    id: 98,
    service: "Authentication",
    title: "Login request failures",
    severity: "high",
    status: "resolved",
    timestamp: "2026-09-29T14:15:00.000Z",
    resolvedAt: "2026-09-29T14:47:00.000Z",
  },

  {
    id: 97,
    service: "Public API",
    title: "Service restarted successfully",
    severity: "low",
    status: "resolved",
    timestamp: "2026-09-29T10:08:00.000Z",
    resolvedAt: "2026-09-29T10:21:00.000Z",
  },

  {
    id: 96,
    service: "File Storage",
    title: "Temporary upload delays",
    severity: "medium",
    status: "resolved",
    timestamp: "2026-09-28T18:32:00.000Z",
    resolvedAt: "2026-09-28T19:05:00.000Z",
  },

  {
    id: 95,
    service: "Reporting Service",
    title: "Report generation slowdown",
    severity: "medium",
    status: "resolved",
    timestamp: "2026-09-27T12:14:00.000Z",
    resolvedAt: "2026-09-27T13:02:00.000Z",
  },

  {
    id: 94,
    service: "Database",
    title: "Connection pool saturation",
    severity: "critical",
    status: "resolved",
    timestamp: "2026-09-26T07:45:00.000Z",
    resolvedAt: "2026-09-26T08:36:00.000Z",
  },
];