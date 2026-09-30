export type Page =
  | "overview"
  | "services"
  | "incidents"
  | "history"
  | "analytics";

export type ServiceStatus =
  | "online"
  | "warning"
  | "offline"
  | "unknown";

export type EditableServiceStatus =
  Exclude<ServiceStatus, "unknown">;

export type IncidentSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info"
  | "unknown";

export type ServiceFilter =
  | "all"
  | ServiceStatus;

export type IncidentFilter =
  | "all"
  | IncidentSeverity;

export type HistoryFilter =
  | "all"
  | "active"
  | "resolved";

export type Service = {
  id: number | string;
  name: string;
  status: string;

  uptime?:
    | number
    | string;

  responseTime?: number;

  latency?: number;

  description?: string;
};

export type Incident = {
  id: number | string;

  title?: string;
  name?: string;

  service?: string;
  serviceName?: string;

  severity?: string;

  status?: string;

  description?: string;

  createdAt?: string;
  timestamp?: string;

  resolvedAt?:
    | string
    | null;
};

export type IncidentFormState = {
  service: string;

  title: string;

  severity: Exclude<
    IncidentSeverity,
    "unknown"
  >;
};

export type EditIncidentFormState = {
  service: string;

  title: string;

  severity: Exclude<
    IncidentSeverity,
    "unknown"
  >;
};

export type ServiceFormState = {
  name: string;

  status:
    EditableServiceStatus;

  responseTime: string;

  uptime: string;
};

export type CreateServiceFormState = {
  name: string;

  status:
    EditableServiceStatus;

  responseTime: string;

  uptime: string;
};

export type Overview = {
  totalServices: number;

  onlineServices: number;

  warningServices: number;

  offlineServices: number;

  activeIncidents: number;

  averageResponse: number;

  averageUptime: number;
};