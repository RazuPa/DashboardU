import type {
  Incident,
  Service,
} from "../types/dashboard";

import {
  formatDate,
  formatUptime,
  getResponseTime,
  normalizeServiceStatus,
} from "../utils/dashboard";

type ServiceDetailsModalProps = {
  service: Service;
  incidents: Incident[];
  activeCount: number;
  resolvedCount: number;

  onClose: () => void;

  onEdit: (
    service: Service
  ) => void;

  onViewIncident: (
    incident: Incident
  ) => void;
};

function ServiceDetailsModal({
  service,
  incidents,
  activeCount,
  resolvedCount,
  onClose,
  onEdit,
  onViewIncident,
}: ServiceDetailsModalProps) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(
        event
      ) => {
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
              SERVICE DETAILS
            </span>

            <h3>
              {service.name}
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
                Service ID
              </span>

              <strong>
                #{service.id}
              </strong>
            </div>

            <div className="analytics-row">
              <span>
                Status
              </span>

              <span
                className={`status-badge ${normalizeServiceStatus(
                  service.status
                )}`}
              >
                {service.status}
              </span>
            </div>

            <div className="analytics-row">
              <span>
                Response Time
              </span>

              <strong>
                {getResponseTime(
                  service
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
                  service.uptime
                )}
              </strong>
            </div>

            <div className="analytics-row">
              <span>
                Total Incidents
              </span>

              <strong>
                {
                  incidents.length
                }
              </strong>
            </div>

            <div className="analytics-row">
              <span>
                Active Incidents
              </span>

              <strong>
                {activeCount}
              </strong>
            </div>

            <div className="analytics-row">
              <span>
                Resolved Incidents
              </span>

              <strong>
                {resolvedCount}
              </strong>
            </div>
          </div>

          <div>
            <span className="eyebrow">
              RELATED INCIDENTS
            </span>

            <div
              className="incident-list"
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
              {incidents.length ===
              0 ? (
                <div className="empty-state">
                  No incidents recorded for this service.
                </div>
              ) : (
                incidents
                  .slice(0, 5)
                  .map(
                    (
                      incident
                    ) => (
                      <div
                        className="incident-row"
                        key={
                          incident.id
                        }
                      >
                        <div>
                          <strong>
                            {incident.title ??
                              "Untitled incident"}
                          </strong>

                          <span>
                            {formatDate(
                              incident.timestamp
                            )}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="secondary-action"
                          onClick={() =>
                            onViewIncident(
                              incident
                            )
                          }
                        >
                          Details
                        </button>
                      </div>
                    )
                  )
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="button"
              className="primary-action"
              onClick={() =>
                onEdit(
                  service
                )
              }
            >
              Edit Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailsModal;