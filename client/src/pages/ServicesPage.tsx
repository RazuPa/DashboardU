import ServiceRow from "../components/ServiceRow";

import type {
  Service,
  ServiceFilter,
} from "../types/dashboard";

type ServicesPageProps = {
  services: Service[];
  filteredServices: Service[];

  onlineServices: number;
  warningServices: number;
  offlineServices: number;

  serviceSearch: string;
  serviceFilter: ServiceFilter;

  deletingServiceId:
    | number
    | string
    | null;

  onSearchChange: (
    value: string
  ) => void;

  onFilterChange: (
    value: ServiceFilter
  ) => void;

  onServiceDetails: (
    service: Service
  ) => void;

  onEditService: (
    service: Service
  ) => void;

  onCreateService: () => void;

  onDeleteService: (
    service: Service
  ) => void;
};

function ServicesPage({
  services,
  filteredServices,
  onlineServices,
  warningServices,
  offlineServices,
  serviceSearch,
  serviceFilter,
  deletingServiceId,
  onSearchChange,
  onFilterChange,
  onServiceDetails,
  onEditService,
  onCreateService,
  onDeleteService,
}: ServicesPageProps) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <p>
            Total Services
          </p>

          <strong>
            {services.length}
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
            Warnings
          </p>

          <strong>
            {warningServices}
          </strong>

          <span>
            Need attention
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

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              SERVICE DIRECTORY
            </span>

            <h3>
              All Services
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span>
              {filteredServices.length}/
              {services.length}
            </span>

            <button
              type="button"
              className="primary-action"
              onClick={
                onCreateService
              }
            >
              + Add Service
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <input
            value={
              serviceSearch
            }
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search services..."
          />

          <select
            value={
              serviceFilter
            }
            onChange={(event) =>
              onFilterChange(
                event.target
                  .value as ServiceFilter
              )
            }
          >
            <option value="all">
              All statuses
            </option>

            <option value="online">
              Online
            </option>

            <option value="warning">
              Warning
            </option>

            <option value="offline">
              Offline
            </option>

            <option value="unknown">
              Unknown
            </option>
          </select>
        </div>

        <div className="service-list">
          {filteredServices.length ===
          0 ? (
            <div className="empty-state">
              No services match your filters.
            </div>
          ) : (
            filteredServices.map(
              (service) => {
                const deleting =
                  deletingServiceId ===
                  service.id;

                return (
                  <div
                    key={
                      service.id
                    }
                    style={{
                      display:
                        "flex",
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
                      <ServiceRow
                        service={
                          service
                        }
                        showActions
                        onDetails={
                          onServiceDetails
                        }
                        onEdit={
                          onEditService
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="secondary-action"
                      disabled={
                        deleting
                      }
                      onClick={() =>
                        onDeleteService(
                          service
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

export default ServicesPage;