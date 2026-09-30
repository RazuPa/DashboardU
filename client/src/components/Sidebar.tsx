

type Page =
  | "overview"
  | "services"
  | "incidents"
  | "history"
  | "analytics";

type SidebarProps = {
  page: Page;
  onChangePage: (page: Page) => void;
};

function Sidebar({
  page,
  onChangePage,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          D
        </div>

        <div>
          <h1>
            DashboardU
          </h1>

          <span>
            Operations Monitor
          </span>
        </div>
      </div>

      <nav className="nav">
        <button
          type="button"
          className={`nav-item ${
            page === "overview"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onChangePage(
              "overview"
            )
          }
        >
          <span className="nav-icon">
            ■
          </span>

          Overview
        </button>

        <button
          type="button"
          className={`nav-item ${
            page === "services"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onChangePage(
              "services"
            )
          }
        >
          <span className="nav-icon">
            ◉
          </span>

          Services
        </button>

        <button
          type="button"
          className={`nav-item ${
            page === "incidents"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onChangePage(
              "incidents"
            )
          }
        >
          <span className="nav-icon">
            △
          </span>

          Incidents
        </button>

        <button
          type="button"
          className={`nav-item ${
            page === "history"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onChangePage(
              "history"
            )
          }
        >
          <span className="nav-icon">
            ◷
          </span>

          History
        </button>

        <button
          type="button"
          className={`nav-item ${
            page === "analytics"
              ? "active"
              : ""
          }`}
          onClick={() =>
            onChangePage(
              "analytics"
            )
          }
        >
          <span className="nav-icon">
            ⌁
          </span>

          Analytics
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="environment-row">
          <span className="environment-dot" />

          <div>
            <strong>
              Environment
            </strong>

            <span>
              Production
            </span>
          </div>
        </div>

        <span className="version">
          DashboardU v1.0
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;