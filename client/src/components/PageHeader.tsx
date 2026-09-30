type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;

  lastUpdated: Date | null;

  refreshing: boolean;

  showReportIncident: boolean;

  onRefresh: () => void;
  onReportIncident: () => void;
};

function PageHeader({
  eyebrow,
  title,
  subtitle,
  lastUpdated,
  refreshing,
  showReportIncident,
  onRefresh,
  onReportIncident,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">
          {eyebrow}
        </div>

        <h2>
          {title}
        </h2>

        <p className="subtitle">
          {subtitle}
        </p>

        {lastUpdated && (
          <p
            className="subtitle"
            style={{
              marginTop: "6px",
              fontSize: "11px",
            }}
          >
            Last updated{" "}
            {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {showReportIncident && (
          <button
            type="button"
            className="primary-action"
            onClick={
              onReportIncident
            }
          >
            + Report Incident
          </button>
        )}

        <button
          type="button"
          className="live-badge"
          onClick={
            onRefresh
          }
          disabled={
            refreshing
          }
        >
          {refreshing
            ? "Refreshing..."
            : "↻ Refresh"}
        </button>

        <div className="live-badge">
          <span className="live-dot" />

          Live
        </div>
      </div>
    </header>
  );
}

export default PageHeader;