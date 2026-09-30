import IncidentRow from "../components/IncidentRow";

import type {
  Incident,
  IncidentFilter,
} from "../types/dashboard";

type IncidentsPageProps = {
  incidents: Incident[];
  filteredIncidents: Incident[];

  criticalIncidents: number;
  highIncidents: number;
  affectedServices: number;

  incidentSearch: string;
  incidentFilter: IncidentFilter;

  resolvingIncidentId:
    | number
    | string
    | null;

  deletingIncidentId:
    | number
    | string
    | null;

  onSearchChange: (
    value: string
  ) => void;

  onFilterChange: (
    value: IncidentFilter
  ) => void;

  onIncidentDetails: (
    incident: Incident
  ) => void;

  onResolveIncident: (
    incident: Incident
  ) => void;

  onEditIncident: (
    incident: Incident
  ) => void;

  onDeleteIncident: (
    incident: Incident
  ) => void;
};

function IncidentsPage({
  incidents,
  filteredIncidents,
  criticalIncidents,
  highIncidents,
  affectedServices,
  incidentSearch,
  incidentFilter,
  resolvingIncidentId,
  deletingIncidentId,
  onSearchChange,
  onFilterChange,
  onIncidentDetails,
  onResolveIncident,
  onEditIncident,
  onDeleteIncident,
}: IncidentsPageProps) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <p>
            Active Incidents
          </p>

          <strong>
            {incidents.length}
          </strong>
        </div>

        <div className="stat-card">
          <p>
            Critical
          </p>

          <strong>
            {criticalIncidents}
          </strong>
        </div>

        <div className="stat-card">
          <p>
            High
          </p>

          <strong>
            {highIncidents}
          </strong>
        </div>

        <div className="stat-card">
          <p>
            Affected Services
          </p>

          <strong>
            {affectedServices}
          </strong>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              INCIDENT LOG
            </span>

            <h3>
              Active Incidents
            </h3>
          </div>

          <span>
            {filteredIncidents.length}/
            {incidents.length}
          </span>
        </div>

        <div className="filter-bar">
          <input
            value={incidentSearch}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search incidents..."
          />

          <select
            value={incidentFilter}
            onChange={(event) =>
              onFilterChange(
                event.target
                  .value as IncidentFilter
              )
            }
          >
            <option value="all">
              All severities
            </option>

            <option value="critical">
              Critical
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>

            <option value="info">
              Info
            </option>
          </select>
        </div>

        <div className="incident-list">
          {filteredIncidents.length === 0 ? (
            <div className="empty-state">
              No active incidents.
            </div>
          ) : (
            filteredIncidents.map(
              (incident) => {
                const resolving =
                  resolvingIncidentId ===
                  incident.id;

                const deleting =
                  deletingIncidentId ===
                  incident.id;

                return (
                  <div
                    key={incident.id}
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <IncidentRow
                        incident={
                          incident
                        }
                        showActions={
                          false
                        }
                        resolving={
                          resolving
                        }
                        onDetails={
                          onIncidentDetails
                        }
                        onResolve={
                          onResolveIncident
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="secondary-action"
                      onClick={() =>
                        onIncidentDetails(
                          incident
                        )
                      }
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      className="secondary-action"
                      onClick={() =>
                        onEditIncident(
                          incident
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="primary-action"
                      disabled={
                        resolving ||
                        deleting
                      }
                      onClick={() =>
                        onResolveIncident(
                          incident
                        )
                      }
                    >
                      {resolving
                        ? "Resolving..."
                        : "Resolve"}
                    </button>

                    <button
                      type="button"
                      className="secondary-action"
                      disabled={
                        deleting ||
                        resolving
                      }
                      onClick={() =>
                        onDeleteIncident(
                          incident
                        )
                      }
                    >
                      {deleting
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                );
              }
            )
          )}
        </div>
      </section>
    </>
  );
}

export default IncidentsPage;