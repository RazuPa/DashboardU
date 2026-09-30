import {
  demoIncidentHistory,
  demoIncidents,
  demoServices,
} from "../data/demo";

import type {
  CreateServiceFormState,
  EditIncidentFormState,
  Incident,
  IncidentFormState,
  Overview,
  Service,
  ServiceFormState,
} from "../types/dashboard";

import {
  getResponseTime,
  normalizeServiceStatus,
  parseUptime,
} from "../utils/dashboard";

import API_BASE from "../config/api";

// ============================================================
// DEMO MODE
// ============================================================

export const IS_DEMO_MODE =
  window.location.hostname.endsWith(
    "github.io"
  );

let demoServicesState: Service[] =
  demoServices.map(
    (service) => ({
      ...service,
    })
  );

let demoIncidentsState: Incident[] =
  demoIncidents.map(
    (incident) => ({
      ...incident,
    })
  );

let demoHistoryState: Incident[] =
  demoIncidentHistory.map(
    (incident) => ({
      ...incident,
    })
  );

// ============================================================
// RESPONSE HELPER
// ============================================================

async function parseResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}.`;

    try {
      const data =
        await response.json();

      if (
        data &&
        typeof data.error ===
          "string"
      ) {
        message =
          data.error;
      }
    } catch {
      // Keep fallback message.
    }

    throw new Error(
      message
    );
  }

  return response.json() as Promise<T>;
}

// ============================================================
// SERVICES - GET
// ============================================================

export async function getServices(): Promise<
  Service[]
> {
  if (IS_DEMO_MODE) {
    return demoServicesState.map(
      (service) => ({
        ...service,
      })
    );
  }

  const response =
    await fetch(
      `${API_BASE}/api/services`
    );

  return parseResponse<
    Service[]
  >(response);
}

// ============================================================
// SERVICES - CREATE
// ============================================================

export async function createService(
  form: CreateServiceFormState
): Promise<Service> {
  if (IS_DEMO_MODE) {
    const name =
      form.name.trim();

    if (!name) {
      throw new Error(
        "Service name is required."
      );
    }

    const duplicate =
      demoServicesState.some(
        (service) =>
          service.name
            .toLowerCase() ===
          name.toLowerCase()
      );

    if (duplicate) {
      throw new Error(
        "A service with this name already exists."
      );
    }

    const ids =
      demoServicesState
        .map((service) =>
          Number(
            service.id
          )
        )
        .filter(
          Number.isFinite
        );

    const nextId =
      ids.length > 0
        ? Math.max(
            ...ids
          ) + 1
        : 1;

    const service: Service = {
      id: nextId,

      name,

      status:
        form.status,

      responseTime:
        Number(
          form.responseTime
        ),

      uptime:
        Number(
          form.uptime
        ),
    };

    demoServicesState = [
      ...demoServicesState,
      service,
    ];

    return {
      ...service,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/services`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name:
            form.name.trim(),

          status:
            form.status,

          responseTime:
            Number(
              form.responseTime
            ),

          uptime:
            Number(
              form.uptime
            ),
        }),
      }
    );

  return parseResponse<Service>(
    response
  );
}

// ============================================================
// SERVICES - UPDATE
// ============================================================

export async function updateService(
  serviceId:
    | number
    | string,

  form: ServiceFormState
): Promise<Service> {
  if (IS_DEMO_MODE) {
    const existing =
      demoServicesState.find(
        (service) =>
          String(
            service.id
          ) ===
          String(
            serviceId
          )
      );

    if (!existing) {
      throw new Error(
        "Service not found."
      );
    }

    const name =
      form.name.trim();

    if (!name) {
      throw new Error(
        "Service name is required."
      );
    }

    const duplicate =
      demoServicesState.some(
        (service) =>
          String(
            service.id
          ) !==
            String(
              serviceId
            ) &&
          service.name
            .toLowerCase() ===
            name.toLowerCase()
      );

    if (duplicate) {
      throw new Error(
        "A service with this name already exists."
      );
    }

    const oldName =
      existing.name;

    const updatedService: Service = {
      ...existing,

      name,

      status:
        form.status,

      responseTime:
        Number(
          form.responseTime
        ),

      uptime:
        Number(
          form.uptime
        ),
    };

    demoServicesState =
      demoServicesState.map(
        (service) =>
          String(
            service.id
          ) ===
          String(
            serviceId
          )
            ? updatedService
            : service
      );

    // Incidents reference services
    // by name, so keep them synced.
    demoIncidentsState =
      demoIncidentsState.map(
        (incident) =>
          incident.service ===
          oldName
            ? {
                ...incident,

                service:
                  name,
              }
            : incident
      );

    demoHistoryState =
      demoHistoryState.map(
        (incident) =>
          incident.service ===
          oldName
            ? {
                ...incident,

                service:
                  name,
              }
            : incident
      );

    return {
      ...updatedService,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/services/${serviceId}`,
      {
        method:
          "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name:
            form.name.trim(),

          status:
            form.status,

          responseTime:
            Number(
              form.responseTime
            ),

          uptime:
            Number(
              form.uptime
            ),
        }),
      }
    );

  return parseResponse<Service>(
    response
  );
}

// ============================================================
// SERVICES - DELETE
// ============================================================

export async function deleteService(
  serviceId:
    | number
    | string
): Promise<{
  success: boolean;
}> {
  if (IS_DEMO_MODE) {
    const exists =
      demoServicesState.some(
        (service) =>
          String(
            service.id
          ) ===
          String(
            serviceId
          )
      );

    if (!exists) {
      throw new Error(
        "Service not found."
      );
    }

    demoServicesState =
      demoServicesState.filter(
        (service) =>
          String(
            service.id
          ) !==
          String(
            serviceId
          )
      );

    return {
      success: true,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/services/${serviceId}`,
      {
        method:
          "DELETE",
      }
    );

  return parseResponse<{
    success: boolean;
  }>(response);
}

// ============================================================
// INCIDENTS - GET ACTIVE
// ============================================================

export async function getIncidents(): Promise<
  Incident[]
> {
  if (IS_DEMO_MODE) {
    return demoIncidentsState.map(
      (incident) => ({
        ...incident,
      })
    );
  }

  const response =
    await fetch(
      `${API_BASE}/api/incidents`
    );

  return parseResponse<
    Incident[]
  >(response);
}

// ============================================================
// INCIDENTS - HISTORY
// ============================================================

export async function getIncidentHistory(): Promise<
  Incident[]
> {
  if (IS_DEMO_MODE) {
    return demoHistoryState.map(
      (incident) => ({
        ...incident,
      })
    );
  }

  const response =
    await fetch(
      `${API_BASE}/api/incidents/history`
    );

  return parseResponse<
    Incident[]
  >(response);
}

// ============================================================
// INCIDENTS - CREATE
// ============================================================

export async function createIncident(
  form: IncidentFormState
): Promise<Incident> {
  if (IS_DEMO_MODE) {
    const ids =
      demoHistoryState
        .map((incident) =>
          Number(
            incident.id
          )
        )
        .filter(
          Number.isFinite
        );

    const nextId =
      ids.length > 0
        ? Math.max(
            ...ids
          ) + 1
        : 1;

    const timestamp =
      new Date().toISOString();

    const incident: Incident = {
      id: nextId,

      service:
        form.service.trim(),

      title:
        form.title.trim(),

      severity:
        form.severity,

      timestamp,

      status:
        "active",

      resolvedAt:
        null,
    };

    demoIncidentsState = [
      incident,
      ...demoIncidentsState,
    ];

    demoHistoryState = [
      incident,
      ...demoHistoryState,
    ];

    return {
      ...incident,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/incidents`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          service:
            form.service.trim(),

          title:
            form.title.trim(),

          severity:
            form.severity,
        }),
      }
    );

  return parseResponse<Incident>(
    response
  );
}

// ============================================================
// INCIDENTS - UPDATE
// ============================================================

export async function updateIncident(
  incidentId:
    | number
    | string,

  form: EditIncidentFormState
): Promise<Incident> {
  if (IS_DEMO_MODE) {
    const existing =
      demoHistoryState.find(
        (incident) =>
          String(
            incident.id
          ) ===
          String(
            incidentId
          )
      );

    if (!existing) {
      throw new Error(
        "Incident not found."
      );
    }

    const updatedIncident: Incident = {
      ...existing,

      service:
        form.service.trim(),

      title:
        form.title.trim(),

      severity:
        form.severity,
    };

    demoHistoryState =
      demoHistoryState.map(
        (incident) =>
          String(
            incident.id
          ) ===
          String(
            incidentId
          )
            ? updatedIncident
            : incident
      );

    demoIncidentsState =
      demoIncidentsState.map(
        (incident) =>
          String(
            incident.id
          ) ===
          String(
            incidentId
          )
            ? updatedIncident
            : incident
      );

    return {
      ...updatedIncident,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/incidents/${incidentId}`,
      {
        method:
          "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          service:
            form.service,

          title:
            form.title,

          severity:
            form.severity,
        }),
      }
    );

  return parseResponse<Incident>(
    response
  );
}

// ============================================================
// INCIDENTS - DELETE
// ============================================================

export async function deleteIncident(
  incidentId:
    | number
    | string
): Promise<{
  success: boolean;
}> {
  if (IS_DEMO_MODE) {
    const exists =
      demoHistoryState.some(
        (incident) =>
          String(
            incident.id
          ) ===
          String(
            incidentId
          )
      );

    if (!exists) {
      throw new Error(
        "Incident not found."
      );
    }

    demoHistoryState =
      demoHistoryState.filter(
        (incident) =>
          String(
            incident.id
          ) !==
          String(
            incidentId
          )
      );

    demoIncidentsState =
      demoIncidentsState.filter(
        (incident) =>
          String(
            incident.id
          ) !==
          String(
            incidentId
          )
      );

    return {
      success: true,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/incidents/${incidentId}`,
      {
        method:
          "DELETE",
      }
    );

  return parseResponse<{
    success: boolean;
  }>(response);
}

// ============================================================
// INCIDENTS - RESOLVE
// ============================================================

export async function resolveIncident(
  incidentId:
    | number
    | string
): Promise<Incident> {
  if (IS_DEMO_MODE) {
    const existing =
      demoHistoryState.find(
        (incident) =>
          String(
            incident.id
          ) ===
          String(
            incidentId
          )
      );

    if (!existing) {
      throw new Error(
        "Incident not found."
      );
    }

    const resolved: Incident = {
      ...existing,

      status:
        "resolved",

      resolvedAt:
        new Date().toISOString(),
    };

    demoHistoryState =
      demoHistoryState.map(
        (incident) =>
          String(
            incident.id
          ) ===
          String(
            incidentId
          )
            ? resolved
            : incident
      );

    demoIncidentsState =
      demoIncidentsState.filter(
        (incident) =>
          String(
            incident.id
          ) !==
          String(
            incidentId
          )
      );

    return {
      ...resolved,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/incidents/${incidentId}/resolve`,
      {
        method:
          "PATCH",
      }
    );

  return parseResponse<Incident>(
    response
  );
}

// ============================================================
// OVERVIEW
// ============================================================

export async function getOverview(): Promise<
  Overview
> {
  if (IS_DEMO_MODE) {
    const totalServices =
      demoServicesState.length;

    const onlineServices =
      demoServicesState.filter(
        (service) =>
          normalizeServiceStatus(
            service.status
          ) ===
          "online"
      ).length;

    const warningServices =
      demoServicesState.filter(
        (service) =>
          normalizeServiceStatus(
            service.status
          ) ===
          "warning"
      ).length;

    const offlineServices =
      demoServicesState.filter(
        (service) =>
          normalizeServiceStatus(
            service.status
          ) ===
          "offline"
      ).length;

    const responseValues =
      demoServicesState
        .map((service) =>
          getResponseTime(
            service
          )
        )
        .filter(
          (value) =>
            value > 0
        );

    const uptimeValues =
      demoServicesState
        .map((service) =>
          parseUptime(
            service.uptime
          )
        )
        .filter(
          (
            value
          ): value is number =>
            value !== null
        );

    const averageResponse =
      responseValues.length >
      0
        ? Math.round(
            responseValues.reduce(
              (
                total,
                value
              ) =>
                total +
                value,
              0
            ) /
              responseValues.length
          )
        : 0;

    const averageUptime =
      uptimeValues.length >
      0
        ? uptimeValues.reduce(
            (
              total,
              value
            ) =>
              total +
              value,
            0
          ) /
          uptimeValues.length
        : 0;

    return {
      totalServices,

      onlineServices,

      warningServices,

      offlineServices,

      activeIncidents:
        demoIncidentsState.length,

      averageResponse,

      averageUptime,
    };
  }

  const response =
    await fetch(
      `${API_BASE}/api/overview`
    );

  return parseResponse<Overview>(
    response
  );
}