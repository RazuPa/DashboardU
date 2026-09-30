import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

type AnalyticsChartsProps = {
  serviceHealthData: PieDatum[];
  incidentStatusData: PieDatum[];
  responseTimeData: ResponseTimeDatum[];
  severityData: SeverityDatum[];
};

function AnalyticsCharts({
  serviceHealthData,
  incidentStatusData,
  responseTimeData,
  severityData,
}: AnalyticsChartsProps) {
  const tooltipStyle = {
    backgroundColor: "#11151b",
    border: "1px solid #303744",
    borderRadius: "8px",
    color: "#f5f7fa",
    fontSize: "11px",
  };

  return (
    <>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">
                INFRASTRUCTURE
              </span>

              <h3>
                Service Health
              </h3>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "310px",
              padding: "12px",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={
                    serviceHealthData
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {serviceHealthData.map(
                    (entry) => (
                      <Cell
                        key={
                          entry.name
                        }
                        fill={
                          entry.color
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />

                <Legend
                  wrapperStyle={{
                    fontSize:
                      "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">
                INCIDENTS
              </span>

              <h3>
                Active vs Resolved
              </h3>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: "310px",
              padding: "12px",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={
                    incidentStatusData
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {incidentStatusData.map(
                    (entry) => (
                      <Cell
                        key={
                          entry.name
                        }
                        fill={
                          entry.color
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                />

                <Legend
                  wrapperStyle={{
                    fontSize:
                      "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              PERFORMANCE
            </span>

            <h3>
              Service Response Times
            </h3>
          </div>

          <span>
            milliseconds
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: "360px",
            padding:
              "24px 18px 10px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={
                responseTimeData
              }
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#202630"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#5f6672"
                tick={{
                  fill:
                    "#777e8a",
                  fontSize:
                    10,
                }}
                angle={-20}
                textAnchor="end"
                interval={0}
              />

              <YAxis
                stroke="#5f6672"
                tick={{
                  fill:
                    "#777e8a",
                  fontSize:
                    10,
                }}
              />

              <Tooltip
                contentStyle={
                  tooltipStyle
                }
              />

              <Bar
                dataKey="responseTime"
                fill="#8d9aab"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">
              INCIDENT ANALYSIS
            </span>

            <h3>
              Incidents by Severity
            </h3>
          </div>

          <span>
            all recorded incidents
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: "330px",
            padding:
              "24px 18px 12px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={
                severityData
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#202630"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#5f6672"
                tick={{
                  fill:
                    "#777e8a",
                  fontSize:
                    10,
                }}
              />

              <YAxis
                allowDecimals={
                  false
                }
                stroke="#5f6672"
                tick={{
                  fill:
                    "#777e8a",
                  fontSize:
                    10,
                }}
              />

              <Tooltip
                contentStyle={
                  tooltipStyle
                }
              />

              <Bar
                dataKey="count"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              >
                {severityData.map(
                  (entry) => (
                    <Cell
                      key={
                        entry.name
                      }
                      fill={
                        entry.color
                      }
                    />
                  )
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

export default AnalyticsCharts;