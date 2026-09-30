import type { Incident } from "../types/dashboard";

import {
  formatDate,
  normalizeSeverity,
} from "../utils/dashboard";

type IncidentRowProps = {
  incident: Incident;
  showActions?: boolean;
  resolving: boolean;

  onDetails: (
    incident: Incident
  ) => void;

  onResolve: (
    incident: Incident
  ) => void;
};

function IncidentRow({
  incident,
  showActions = false,
  resolving,
  onDetails,
  onResolve,
}: IncidentRowProps) {
  const severity =
    normalizeSeverity(
      incident.severity
    );

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
      </div>

      <div className="row-actions">
        <span
          className={`severity-badge ${severity}`}
        >
          {incident.severity ??
            "unknown"}
        </span>

        {showActions && (
          <>
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

            <button
              type="button"
              className="secondary-action"
              disabled={
                resolving
              }
              onClick={() =>
                onResolve(
                  incident
                )
              }
            >
              {resolving
                ? "Resolving..."
                : "Resolve"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default IncidentRow;