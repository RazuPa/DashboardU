import {
  lazy,
  Suspense,
} from "react";

const AnalyticsCharts =
  lazy(
    () =>
      import(
        "../components/AnalyticsCharts"
      )
  );

type PieDatum = {
  name: string;
  value: number;
  color: string;
};

type SeverityDatum = {
  name: string;
  count: number;
  color: string;
};

type ResponseTimeDatum = {
  name: string;
  responseTime: number;
};

type AnalyticsPageProps = {
  averageUptime: number;
  averageResponseTime: number;
  availability: number;
  activeIncidents: number;

  serviceHealthData: PieDatum[];
  incidentStatusData: PieDatum[];
  responseTimeData: ResponseTimeDatum[];
  severityData: SeverityDatum[];
};

function AnalyticsPage({
  averageUptime,
  averageResponseTime,
  availability,
  activeIncidents,
  serviceHealthData,
  incidentStatusData,
  responseTimeData,
  severityData,
}: AnalyticsPageProps) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <p>
            Average Uptime
          </p>

          <strong>
            {averageUptime.toFixed(
              2
            )}
            %
          </strong>

          <span>
            Across all services
          </span>
        </div>

        <div className="stat-card">
          <p>
            Average Latency
          </p>

          <strong>
            {averageResponseTime} ms
          </strong>

          <span>
            Current response time
          </span>
        </div>

        <div className="stat-card">
          <p>
            Availability
          </p>

          <strong>
            {availability}%
          </strong>

          <span>
            Services online
          </span>
        </div>

        <div className="stat-card">
          <p>
            Active Incidents
          </p>

          <strong>
            {activeIncidents}
          </strong>

          <span>
            Currently reported
          </span>
        </div>
      </div>

      <Suspense
        fallback={
          <section className="panel">
            <div className="panel-body">
              Loading analytics...
            </div>
          </section>
        }
      >
        <AnalyticsCharts
          serviceHealthData={
            serviceHealthData
          }
          incidentStatusData={
            incidentStatusData
          }
          responseTimeData={
            responseTimeData
          }
          severityData={
            severityData
          }
        />
      </Suspense>
    </>
  );
}

export default AnalyticsPage;