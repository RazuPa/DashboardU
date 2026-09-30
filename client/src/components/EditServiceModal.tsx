import type {
  FormEvent,
} from "react";

import type {
  EditableServiceStatus,
  Service,
  ServiceFormState,
} from "../types/dashboard";

type EditServiceModalProps = {
  service: Service;

  form: ServiceFormState;

  saving: boolean;

  error: string | null;

  success: string | null;

  onClose: () => void;

  onChange: (
    form: ServiceFormState
  ) => void;

  onSubmit: (
    event:
      FormEvent<HTMLFormElement>
  ) => void;
};

function EditServiceModal({
  service,
  form,
  saving,
  error,
  success,
  onClose,
  onChange,
  onSubmit,
}: EditServiceModalProps) {
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
              INFRASTRUCTURE
            </span>

            <h3>
              Edit Service
            </h3>

            <p
              style={{
                marginTop: "4px",
                opacity: 0.6,
              }}
            >
              Service #{service.id}
            </p>
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
              Service Name
            </span>

            <input
              type="text"
              value={form.name}
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,

                  name:
                    event.target
                      .value,
                })
              }
            />
          </label>

          <label>
            <span>
              Status
            </span>

            <select
              value={form.status}
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,

                  status:
                    event.target
                      .value as EditableServiceStatus,
                })
              }
            >
              <option value="online">
                Online
              </option>

              <option value="warning">
                Warning
              </option>

              <option value="offline">
                Offline
              </option>
            </select>
          </label>

          <label>
            <span>
              Response Time (ms)
            </span>

            <input
              type="number"
              min="0"
              step="1"
              value={
                form.responseTime
              }
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,

                  responseTime:
                    event.target
                      .value,
                })
              }
            />
          </label>

          <label>
            <span>
              Uptime (%)
            </span>

            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.uptime}
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,

                  uptime:
                    event.target
                      .value,
                })
              }
            />
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
              disabled={saving}
              onClick={onClose}
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

export default EditServiceModal;