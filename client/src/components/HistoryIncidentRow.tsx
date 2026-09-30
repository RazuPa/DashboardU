import type { Incident } from "../types/dashboard";

import {
  formatDate,
  normalizeSeverity,
} from "../utils/dashboard";

type HistoryIncidentRowProps = {
  incident: Incident;

  onDetails: (
    incident: Incident
  ) => void;
};

function HistoryIncidentRow({
  incident,
  onDetails,
}: HistoryIncidentRowProps) {
  const severity =
    normalizeSeverity(
      incident.severity
    );

  const resolved =
    incident.status ===
    "resolved";

  return (
    <div className="incident-row">
      <div>
        <strong>
          {incident.title ??
            "Untitled incident"}
        </strong>

        <span>
          {incident.service ??
            "Unknown service"}
        </span>

        <span>
          Reported:{" "}
          {formatDate(
            incident.timestamp
          )}
        </span>

        {resolved && (
          <span>
            Resolved:{" "}
            {formatDate(
              incident.resolvedAt
            )}
          </span>
        )}
      </div>

      <div className="row-actions">
        <span
          className={`severity-badge ${severity}`}
        >
          {incident.severity ??
            "unknown"}
        </span>

        <span
          className={`status-badge ${
            resolved
              ? "online"
              : "warning"
          }`}
        >
          {resolved
            ? "Resolved"
            : "Active"}
        </span>

        <button
          type="button"
          className="secondary-action"
          onClick={() =>
            onDetails(
              incident
            )
          }
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default HistoryIncidentRow;