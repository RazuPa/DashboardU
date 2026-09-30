import ServiceRow from "../components/ServiceRow";
import IncidentRow from "../components/IncidentRow";

import type {
  Incident,
  Overview,
  Service,
} from "../types/dashboard";

type OverviewPageProps = {
  services: Service[];
  incidents: Incident[];

  overview: Overview | null;

  resolvingIncidentId:
    | number
    | string
    | null;

  onServiceDetails: (
    service: Service
  ) => void;

  onEditService: (
    service: Service
  ) => void;

  onIncidentDetails: (
    incident: Incident
  ) => void;

  onResolveIncident: (
    incident: Incident
  ) => void;
};

function OverviewPage({
  services,
  incidents,
  overview,
  resolvingIncidentId,
  onServiceDetails,
  onEditService,
  onIncidentDetails,
  onResolveIncident,
}: OverviewPageProps) {
  // ============================================================
  // FALLBACK VALUES
  // ============================================================

  const fallbackOnlineServices =
    services.filter(
      (service) =>
        service.status === "online"
    ).length;

  const fallbackAvailability =
    services.length === 0
      ? 0
      : Number(
          (
            (fallbackOnlineServices /
              services.length) *
            100
          ).toFixed(1)
        );

  // ============================================================
  // OVERVIEW VALUES
  // ============================================================

  const totalServices =
    overview?.totalServices ??
    services.length;

  const onlineServices =
    overview?.onlineServices ??
    fallbackOnlineServices;

  const activeIncidents =
    overview?.activeIncidents ??
    incidents.length;

  const averageUptime =
    overview?.averageUptime ??
    fallbackAvailability;

  const averageResponse =
    overview?.averageResponse ?? 0;

  const warningServices =
    overview?.warningServices ??
    services.filter(
      (service) =>
        service.status === "warning"
    ).length;

  const offlineServices =
    overview?.offlineServices ??
    services.filter(
      (service) =>
        service.status === "offline"
    ).length;

  return (
    <>
      {/* ====================================================== */}
      {/* STATISTICS */}
      {/* ====================================================== */}

      <div className="stats-grid">
        <div className="stat-card">
          <p>
            Systems Online
          </p>

          <strong>
            {onlineServices}/
            {totalServices}
          </strong>

          <span>
            Operational services
          </span>
        </div>

        <div className="stat-card">
          <p>
            Active Incidents
          </p>

          <strong>
            {activeIncidents}
          </strong>

          <span>
            Reported incidents
          </span>
        </div>

        <div className="stat-card">
          <p>
            Average Response
          </p>

          <strong>
            {averageResponse} ms
          </strong>

          <span>
            Service response time
          </span>
        </div>

        <div className="stat-card">
          <p>
            Average Uptime
          </p>

          <strong>
            {averageUptime}%
          </strong>

          <span>
            Across all services
          </span>
        </div>
      </div>

      {/* ====================================================== */}
      {/* SECONDARY STATUS */}
      {/* ====================================================== */}

      <div className="stats-grid">
        <div className="stat-card">
          <p>
            Total Services
          </p>

          <strong>
            {totalServices}
          </strong>

          <span>
            Monitored systems
          </span>
        </div>

        <div className="stat-card">
          <p>
            Online
          </p>

          <strong>
            {onlineServices}
          </strong>

          <span>
            Healthy services
          </span>
        </div>

        <div className="stat-card">
          <p>
            Warning
          </p>

          <strong>
            {warningServices}
          </strong>

          <span>
            Services requiring attention
          </span>
        </div>

        <div className="stat-card">
          <p>
            Offline
          </p>

          <strong>
            {offlineServices}
          </strong>

          <span>
            Unavailable services
          </span>
        </div>
      </div>

      {/* ====================================================== */}
      {/* DASHBOARD CONTENT */}
      {/* ====================================================== */}

      <div className="dashboard-grid">
        {/* ==================================================== */}
        {/* SERVICES */}
        {/* ==================================================== */}

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">
                INFRASTRUCTURE
              </span>

              <h3>
                Service Status
              </h3>
            </div>
          </div>

          <div className="service-list">
            {services.length === 0 ? (
              <div className="empty-state">
                No services available.
              </div>
            ) : (
              services.map(
                (service) => (
                  <ServiceRow
                    key={
                      service.id
                    }
                    service={
                      service
                    }
                    onDetails={
                      onServiceDetails
                    }
                    onEdit={
                      onEditService
                    }
                  />
                )
              )
            )}
          </div>
        </section>

        {/* ==================================================== */}
        {/* INCIDENTS */}
        {/* ==================================================== */}

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">
                INCIDENTS
              </span>

              <h3>
                Recent Incidents
              </h3>
            </div>
          </div>

          <div className="incident-list">
            {incidents.length ===
            0 ? (
              <div className="empty-state">
                No active incidents.
              </div>
            ) : (
              incidents
                .slice(0, 5)
                .map(
                  (
                    incident
                  ) => (
                    <IncidentRow
                      key={
                        incident.id
                      }
                      incident={
                        incident
                      }
                      resolving={
                        resolvingIncidentId ===
                        incident.id
                      }
                      onDetails={
                        onIncidentDetails
                      }
                      onResolve={
                        onResolveIncident
                      }
                    />
                  )
                )
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default OverviewPage;