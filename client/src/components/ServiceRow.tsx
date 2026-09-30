import type { Service } from "../types/dashboard";

import {
  formatUptime,
  getResponseTime,
  normalizeServiceStatus,
} from "../utils/dashboard";

type ServiceRowProps = {
  service: Service;
  showActions?: boolean;
  onDetails: (service: Service) => void;
  onEdit: (service: Service) => void;
};

function ServiceRow({
  service,
  showActions = false,
  onDetails,
  onEdit,
}: ServiceRowProps) {
  const status =
    normalizeServiceStatus(
      service.status
    );

  return (
    <div className="service-row">
      <div className="service-main">
        <span
          className={`status-dot ${status}`}
        />

        <div>
          <strong>
            {service.name}
          </strong>

          <span>
            {formatUptime(
              service.uptime
            )}{" "}
            uptime
          </span>
        </div>
      </div>

      <div className="service-right">
        <span className="latency">
          {getResponseTime(
            service
          )}{" "}
          ms
        </span>

        <span
          className={`status-badge ${status}`}
        >
          {service.status}
        </span>

        {showActions && (
          <>
            <button
              type="button"
              className="secondary-action"
              onClick={() =>
                onDetails(
                  service
                )
              }
            >
              Details
            </button>

            <button
              type="button"
              className="secondary-action"
              onClick={() =>
                onEdit(
                  service
                )
              }
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceRow;