import type {
  FormEvent,
} from "react";

import type {
  IncidentFormState,
  Service,
} from "../types/dashboard";

type ReportIncidentModalProps = {
  services: Service[];
  form: IncidentFormState;
  submitting: boolean;
  error: string | null;
  success: string | null;

  onClose: () => void;

  onChange: (
    form: IncidentFormState
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
};

function ReportIncidentModal({
  services,
  form,
  submitting,
  error,
  success,
  onClose,
  onChange,
  onSubmit,
}: ReportIncidentModalProps) {
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
              INCIDENT MANAGEMENT
            </span>

            <h3>
              Report Incident
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
              Service
            </span>

            <select
              value={
                form.service
              }
              onChange={(
                event
              ) =>
                onChange({
                  ...form,
                  service:
                    event
                      .target
                      .value,
                })
              }
            >
              {services.map(
                (
                  service
                ) => (
                  <option
                    key={
                      service.id
                    }
                    value={
                      service.name
                    }
                  >
                    {
                      service.name
                    }
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            <span>
              Incident title
            </span>

            <input
              type="text"
              value={
                form.title
              }
              onChange={(
                event
              ) =>
                onChange({
                  ...form,
                  title:
                    event
                      .target
                      .value,
                })
              }
              placeholder="Example: Elevated response times"
              autoFocus
            />
          </label>

          <label>
            <span>
              Severity
            </span>

            <select
              value={
                form.severity
              }
              onChange={(
                event
              ) =>
                onChange({
                  ...form,
                  severity:
                    event
                      .target
                      .value as IncidentFormState["severity"],
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
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-action"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Reporting..."
                : "Report Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportIncidentModal;