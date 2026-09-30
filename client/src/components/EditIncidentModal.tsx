import type {
  FormEvent,
} from "react";

import type {
  EditIncidentFormState,
  Incident,
  IncidentSeverity,
  Service,
} from "../types/dashboard";

type EditIncidentModalProps = {
  incident: Incident;
  services: Service[];
  form: EditIncidentFormState;

  saving: boolean;
  error: string | null;
  success: string | null;

  onClose: () => void;

  onChange: (
    form: EditIncidentFormState
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
};

function EditIncidentModal({
  incident,
  services,
  form,
  saving,
  error,
  success,
  onClose,
  onChange,
  onSubmit,
}: EditIncidentModalProps) {
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
              INCIDENT MANAGEMENT
            </span>

            <h3>
              Edit Incident
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

        <form
          className="incident-form"
          onSubmit={onSubmit}
        >
          <label>
            <span>
              Incident ID
            </span>

            <input
              value={`#${incident.id}`}
              disabled
            />
          </label>

          <label>
            <span>
              Service
            </span>

            <select
              value={form.service}
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,
                  service:
                    event.target.value,
                })
              }
            >
              {services.map(
                (service) => (
                  <option
                    key={service.id}
                    value={
                      service.name
                    }
                  >
                    {service.name}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            <span>
              Title
            </span>

            <input
              type="text"
              value={form.title}
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,
                  title:
                    event.target.value,
                })
              }
            />
          </label>

          <label>
            <span>
              Severity
            </span>

            <select
              value={form.severity}
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,
                  severity:
                    event.target
                      .value as Exclude<
                      IncidentSeverity,
                      "unknown"
                    >,
                })
              }
            >
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
          </label>

          {error && (
            <div className="form-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-message success">
              {success}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-action"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditIncidentModal;