import type {
  Incident,
  Service,
} from "../types/dashboard";

import {
  formatDate,
  formatUptime,
  getResponseTime,
  normalizeServiceStatus,
  normalizeSeverity,
} from "../utils/dashboard";

type IncidentDetailsModalProps = {
  incident: Incident;
  relatedService: Service | null;

  resolving: boolean;
  deleting: boolean;

  onClose: () => void;

  onViewService: (
    service: Service
  ) => void;

  onResolve: (
    incident: Incident
  ) => void;

  onEdit: (
    incident: Incident
  ) => void;

  onDelete: (
    incident: Incident
  ) => void;
};

function IncidentDetailsModal({
  incident,
  relatedService,
  resolving,
  deleting,
  onClose,
  onViewService,
  onResolve,
  onEdit,
  onDelete,
}: IncidentDetailsModalProps) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              INCIDENT DETAILS
            </span>

            <h3>
              {incident.title ??
                "Untitled incident"}
            </h3>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="incident-form">
          <div className="analytics-list">
            <div className="analytics-row">
              <span>
                Incident ID
              </span>

              <strong>
                #{incident.id}
              </strong>
            </div>

            <div className="analytics-row">
              <span>
                Service
              </span>

              <strong>
                {incident.service ??
                  "Unknown"}
              </strong>
            </div>

            <div className="analytics-row">
              <span>
                Severity
              </span>

              <span
                className={`severity-badge ${normalizeSeverity(
                  incident.severity
                )}`}
              >
                {incident.severity ??
                  "Unknown"}
              </span>
            </div>

            <div className="analytics-row">
              <span>
                Status
              </span>

              <span
                className={`status-badge ${
                  incident.status ===
                  "resolved"
                    ? "online"
                    : "warning"
                }`}
              >
                {incident.status ??
                  "active"}
              </span>
            </div>

            <div className="analytics-row">
              <span>
                Reported
              </span>

              <strong>
                {formatDate(
                  incident.timestamp
                )}
              </strong>
            </div>

            {incident.status ===
              "resolved" && (
              <div className="analytics-row">
                <span>
                  Resolved
                </span>

                <strong>
                  {formatDate(
                    incident.resolvedAt
                  )}
                </strong>
              </div>
            )}
          </div>

          {relatedService && (
            <div>
              <span className="eyebrow">
                RELATED SERVICE
              </span>

              <div
                className="analytics-list"
                style={{
                  marginTop:
                    "10px",
                  border:
                    "1px solid #252b35",
                  borderRadius:
                    "10px",
                  overflow:
                    "hidden",
                }}
              >
                <div className="analytics-row">
                  <span>
                    Status
                  </span>

                  <span
                    className={`status-badge ${normalizeServiceStatus(
                      relatedService.status
                    )}`}
                  >
                    {
                      relatedService.status
                    }
                  </span>
                </div>

                <div className="analytics-row">
                  <span>
                    Response Time
                  </span>

                  <strong>
                    {getResponseTime(
                      relatedService
                    )}{" "}
                    ms
                  </strong>
                </div>

                <div className="analytics-row">
                  <span>
                    Uptime
                  </span>

                  <strong>
                    {formatUptime(
                      relatedService.uptime
                    )}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={onClose}
            >
              Close
            </button>

            {relatedService && (
              <button
                type="button"
                className="secondary-action"
                onClick={() =>
                  onViewService(
                    relatedService
                  )
                }
              >
                View Service
              </button>
            )}

            <button
              type="button"
              className="secondary-action"
              onClick={() =>
                onEdit(
                  incident
                )
              }
            >
              Edit
            </button>

            <button
              type="button"
              className="secondary-action"
              disabled={deleting}
              onClick={() =>
                onDelete(
                  incident
                )
              }
            >
              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>

            {incident.status !==
              "resolved" && (
              <button
                type="button"
                className="primary-action"
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
                  : "Resolve Incident"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetailsModal;