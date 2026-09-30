import { useEffect, useState } from "react";
import "./App.css";

type Overview = {
  totalServices: number;
  onlineServices: number;
  activeIncidents: number;
  averageResponse: number;
  averageUptime: number;
};

type Service = {
  id: number;
  name: string;
  status: "online" | "warning" | "offline";
  response_time: number;
  uptime: number;
};

type Incident = {
  id: number;
  service: string;
  title: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
};

function App() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [overviewRes, servicesRes, incidentsRes] =
          await Promise.all([
            fetch("http://localhost:3001/api/overview"),
            fetch("http://localhost:3001/api/services"),
            fetch("http://localhost:3001/api/incidents"),
          ]);

        const overviewData = await overviewRes.json();
        const servicesData = await servicesRes.json();
        const incidentsData = await incidentsRes.json();

        setOverview(overviewData);
        setServices(servicesData);
        setIncidents(incidentsData);
      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading DashboardU...</div>;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">D</div>
          <div>
            <h1>DashboardU</h1>
            <span>Operations</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active">Overview</button>
          <button className="nav-item">Services</button>
          <button className="nav-item">Incidents</button>
          <button className="nav-item">Analytics</button>
        </nav>

        <div className="sidebar-footer">
          <div className="environment">
            <span className="environment-dot" />
            Production
          </div>

          <span>DashboardU v1.0</span>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <p className="eyebrow">OPERATIONS CENTER</p>
            <h2>System Overview</h2>
            <p className="subtitle">
              Monitor services, performance and incidents.
            </p>
          </div>

          <div className="header-status">
            <span className="live-dot" />
            Live
          </div>
        </header>

        {overview && (
          <section className="stats-grid">
            <StatCard
              label="Systems Online"
              value={`${overview.onlineServices}/${overview.totalServices}`}
              detail="Operational services"
            />

            <StatCard
              label="Active Incidents"
              value={overview.activeIncidents.toString()}
              detail="Requires attention"
            />

            <StatCard
              label="Avg. Response"
              value={`${overview.averageResponse} ms`}
              detail="Across all services"
            />

            <StatCard
              label="Average Uptime"
              value={`${overview.averageUptime}%`}
              detail="Last 30 days"
            />
          </section>
        )}

        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">INFRASTRUCTURE</p>
                <h3>Service Status</h3>
              </div>

              <span>{services.length} services</span>
            </div>

            <div className="service-list">
              {services.map((service) => (
                <div className="service-row" key={service.id}>
                  <div className="service-main">
                    <span className={`status-dot ${service.status}`} />

                    <div>
                      <strong>{service.name}</strong>
                      <span>{service.uptime}% uptime</span>
                    </div>
                  </div>

                  <div className="service-meta">
                    <span>
                      {service.response_time === 0
                        ? "—"
                        : `${service.response_time} ms`}
                    </span>

                    <span className={`status-badge ${service.status}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">ACTIVITY</p>
                <h3>Recent Incidents</h3>
              </div>
            </div>

            <div className="incident-list">
              {incidents.map((incident) => (
                <div className="incident-row" key={incident.id}>
                  <div className={`severity ${incident.severity}`} />

                  <div className="incident-content">
                    <div className="incident-top">
                      <strong>{incident.service}</strong>
                      <span>{incident.timestamp}</span>
                    </div>

                    <p>{incident.title}</p>

                    <span className={`severity-label ${incident.severity}`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

export default App;