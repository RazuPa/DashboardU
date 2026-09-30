import type {
  Incident,
  IncidentSeverity,
  Service,
  ServiceStatus,
} from "../types/dashboard";

// ============================================================
// SERVICE HELPERS
// ============================================================

export function normalizeServiceStatus(
  status?: string
): ServiceStatus {
  const value =
    status?.toLowerCase().trim() ?? "";

  if (
    value === "online" ||
    value === "operational" ||
    value === "healthy"
  ) {
    return "online";
  }

  if (
    value === "warning" ||
    value === "degraded" ||
    value === "degraded performance" ||
    value === "partial outage"
  ) {
    return "warning";
  }

  if (
    value === "offline" ||
    value === "down" ||
    value === "outage" ||
    value === "major outage"
  ) {
    return "offline";
  }

  return "unknown";
}

export function getResponseTime(
  service: Service
): number {
  return (
    service.responseTime ??
    service.latency ??
    0
  );
}

export function formatUptime(
  uptime?: number | string
): string {
  if (
    uptime === undefined ||
    uptime === null ||
    uptime === ""
  ) {
    return "—";
  }

  if (typeof uptime === "number") {
    return `${uptime}%`;
  }

  const trimmed =
    uptime.trim();

  return trimmed.endsWith("%")
    ? trimmed
    : `${trimmed}%`;
}

export function parseUptime(
  uptime?: number | string
): number | null {
  if (typeof uptime === "number") {
    return uptime;
  }

  if (typeof uptime === "string") {
    const parsed =
      Number.parseFloat(
        uptime.replace("%", "")
      );

    return Number.isNaN(parsed)
      ? null
      : parsed;
  }

  return null;
}

// ============================================================
// INCIDENT HELPERS
// ============================================================

export function normalizeSeverity(
  severity?: string
): IncidentSeverity {
  const value =
    severity?.toLowerCase().trim() ?? "";

  if (value === "critical") {
    return "critical";
  }

  if (value === "high") {
    return "high";
  }

  if (value === "medium") {
    return "medium";
  }

  if (value === "low") {
    return "low";
  }

  if (value === "info") {
    return "info";
  }

  return "unknown";
}

export function getIncidentDate(
  incident: Incident
): number {
  const value =
    incident.createdAt ??
    incident.timestamp;

  if (!value) {
    return 0;
  }

  const parsed =
    new Date(value).getTime();

  return Number.isNaN(parsed)
    ? 0
    : parsed;
}

// ============================================================
// GENERAL FORMATTING
// ============================================================

export function formatDate(
  date?: string | null
): string {
  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleString();
}