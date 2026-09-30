import HistoryIncidentRow from "../components/HistoryIncidentRow";

import type {
  HistoryFilter,
  Incident,
} from "../types/dashboard";

type HistoryPageProps = {
  incidents: Incident[];
  filteredHistory: Incident[];

  activeCount: number;
  resolvedCount: number;

  historySearch: string;
  historyFilter: HistoryFilter;

  onSearchChange: (
    value: string
  ) => void;

  onFilterChange: (
    value: HistoryFilter
  ) => void;

  onIncidentDetails: (
    incident: Incident
  ) => void;
};

function HistoryPage({
  incidents,
  filteredHistory,
  activeCount,
  resolvedCount,
  historySearch,
  historyFilter,
  onSearchChange,
  onFilterChange,
  onIncidentDetails,
}: HistoryPageProps) {
  const resolutionRate =
    incidents.length > 0
      ? Math.round(
          (resolvedCount /
            incidents.length) *
            100
        )
      : 0;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <p>
            Total Incidents
          </p>

          <strong>
            {incidents.length}
          </strong>

          <span>
            All recorded incidents
          </span>
        </div>

        <div className="stat-card">
          <p>
            Active
          </p>

          <strong>
            {activeCount}
          </strong>

          <span>
            Still unresolved
          </span>
        </div>

        <div className="stat-card">
          <p>
            Resolved
          </p>

          <strong>
            {resolvedCount}
          </strong>

          <span>
            Closed incidents
          </span>
        </div>

        <div className="stat-card">
          <p>
            Resolution Rate
          </p>

          <strong>
            {resolutionRate}%
          </strong>

          <span>
            Incidents resolved
          </span>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              INCIDENT ARCHIVE
            </span>

            <h3>
              Incident History
            </h3>
          </div>

          <span>
            {filteredHistory.length}/
            {incidents.length}
          </span>
        </div>

        <div className="filter-bar">
          <input
            value={
              historySearch
            }
            onChange={(
              event
            ) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search history..."
          />

          <select
            value={
              historyFilter
            }
            onChange={(
              event
            ) =>
              onFilterChange(
                event.target
                  .value as HistoryFilter
              )
            }
          >
            <option value="all">
              All incidents
            </option>

            <option value="active">
              Active
            </option>

            <option value="resolved">
              Resolved
            </option>
          </select>
        </div>

        <div className="incident-list">
          {filteredHistory.length ===
          0 ? (
            <div className="empty-state">
              No incidents found.
            </div>
          ) : (
            filteredHistory.map(
              (incident) => (
                <HistoryIncidentRow
                  key={
                    incident.id
                  }
                  incident={
                    incident
                  }
                  onDetails={
                    onIncidentDetails
                  }
                />
              )
            )
          )}
        </div>
      </section>
    </>
  );
}

export default HistoryPage;