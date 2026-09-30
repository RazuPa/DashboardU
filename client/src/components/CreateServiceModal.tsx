import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import type {
  CreateServiceFormState,
  EditableServiceStatus,
} from "../types/dashboard";

type CreateServiceModalProps = {
  form: CreateServiceFormState;
  saving: boolean;
  error: string | null;
  success: string | null;

  onClose: () => void;

  onChange: (
    form: CreateServiceFormState
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
};

const SERVICE_EXAMPLES = [
  {
    name: "API Gateway",
    responseTime: "42",
    uptime: "99.99",
  },
  {
    name: "Authentication Service",
    responseTime: "65",
    uptime: "99.98",
  },
  {
    name: "Main Database",
    responseTime: "18",
    uptime: "99.995",
  },
  {
    name: "Web Application",
    responseTime: "95",
    uptime: "99.97",
  },
  {
    name: "Payment Service",
    responseTime: "120",
    uptime: "99.95",
  },
  {
    name: "Notification Service",
    responseTime: "85",
    uptime: "99.92",
  },
];

function CreateServiceModal({
  form,
  saving,
  error,
  success,
  onClose,
  onChange,
  onSubmit,
}: CreateServiceModalProps) {
  const [
    customMode,
    setCustomMode,
  ] = useState(false);

  function useExample(
    example:
      (typeof SERVICE_EXAMPLES)[number]
  ) {
    setCustomMode(false);

    onChange({
      ...form,
      name: example.name,
      status: "online",
      responseTime:
        example.responseTime,
      uptime:
        example.uptime,
    });
  }

  function useCustomService() {
    setCustomMode(true);

    onChange({
      ...form,
      name: "",
      responseTime: "0",
      uptime: "100",
    });
  }

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
              Add Service
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
          <div>
            <span
              style={{
                display: "block",
                marginBottom: "10px",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Service examples
            </span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "8px",
              }}
            >
              {SERVICE_EXAMPLES.map(
                (example) => (
                  <button
                    key={
                      example.name
                    }
                    type="button"
                    className="secondary-action"
                    disabled={saving}
                    onClick={() =>
                      useExample(
                        example
                      )
                    }
                    style={{
                      textAlign:
                        "left",
                      justifyContent:
                        "flex-start",
                    }}
                  >
                    {
                      example.name
                    }
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="primary-action"
              disabled={saving}
              onClick={
                useCustomService
              }
              style={{
                width: "100%",
                marginTop: "10px",
              }}
            >
              + Custom Service
            </button>
          </div>

          <label>
            <span>
              Service name
            </span>

            <input
              type="text"
              value={form.name}
              placeholder={
                customMode
                  ? "Enter your own service name"
                  : "Choose an example above or enter a name"
              }
              autoFocus={
                customMode
              }
              disabled={saving}
              onChange={(event) => {
                setCustomMode(
                  true
                );

                onChange({
                  ...form,
                  name:
                    event.target.value,
                });
              }}
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
              Response time (ms)
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
                    event.target.value,
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
              step="0.001"
              value={form.uptime}
              disabled={saving}
              onChange={(event) =>
                onChange({
                  ...form,
                  uptime:
                    event.target.value,
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
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-action"
              disabled={
                saving ||
                !form.name.trim()
              }
            >
              {saving
                ? "Creating..."
                : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateServiceModal;