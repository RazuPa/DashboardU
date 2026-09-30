import express from "express";
import cors from "cors";
import { DatabaseSync } from "node:sqlite";

const app = express();

// ============================================================
// ENVIRONMENT
// ============================================================

const PORT = Number(
  process.env.PORT ?? 3001
);

const DATABASE_PATH =
  process.env.DATABASE_PATH ??
  "dashboardu.db";

const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGIN ??
  "http://localhost:5173"
)
  .split(",")
  .map((origin) =>
    origin.trim()
  )
  .filter(Boolean);

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin(
      origin,
      callback
    ) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (
        CLIENT_ORIGINS.includes(
          origin
        )
      ) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          "Origin not allowed by CORS."
        )
      );
    },

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
    ],
  })
);

app.use(express.json());

// ============================================================
// DATABASE
// ============================================================

const db =
  new DatabaseSync(
    DATABASE_PATH
  );

// ============================================================
// TABLES
// ============================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    response_time INTEGER NOT NULL,
    uptime REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT NOT NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );
`);

// ============================================================
// MIGRATIONS
// ============================================================

const incidentColumns = db
  .prepare(
    "PRAGMA table_info(incidents)"
  )
  .all() as Array<{
  name: string;
}>;

const incidentColumnNames =
  incidentColumns.map(
    (column) =>
      column.name
  );

if (
  !incidentColumnNames.includes(
    "status"
  )
) {
  db.exec(`
    ALTER TABLE incidents
    ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
  `);
}

if (
  !incidentColumnNames.includes(
    "resolved_at"
  )
) {
  db.exec(`
    ALTER TABLE incidents
    ADD COLUMN resolved_at TEXT
  `);
}

// ============================================================
// SEED SERVICES
// ============================================================

const serviceCount = db
  .prepare(`
    SELECT COUNT(*) AS count
    FROM services
  `)
  .get() as {
  count: number;
};

if (serviceCount.count === 0) {
  const insertService =
    db.prepare(`
      INSERT INTO services
      (
        name,
        status,
        response_time,
        uptime
      )
      VALUES (?, ?, ?, ?)
    `);

  insertService.run(
    "Public API",
    "online",
    84,
    99.99
  );

  insertService.run(
    "Authentication",
    "online",
    112,
    99.97
  );

  insertService.run(
    "Database",
    "warning",
    268,
    99.91
  );

  insertService.run(
    "Reporting Service",
    "online",
    143,
    99.95
  );

  insertService.run(
    "Notification Worker",
    "offline",
    0,
    98.72
  );

  insertService.run(
    "File Storage",
    "online",
    96,
    99.98
  );
}

// ============================================================
// SEED INCIDENTS
// ============================================================

const incidentCount = db
  .prepare(`
    SELECT COUNT(*) AS count
    FROM incidents
  `)
  .get() as {
  count: number;
};

if (
  incidentCount.count === 0
) {
  const insertIncident =
    db.prepare(`
      INSERT INTO incidents
      (
        service,
        title,
        severity,
        timestamp,
        status
      )
      VALUES (?, ?, ?, ?, 'active')
    `);

  insertIncident.run(
    "Database",
    "Response time above threshold",
    "medium",
    new Date().toISOString()
  );

  insertIncident.run(
    "Notification Worker",
    "Service unavailable",
    "high",
    new Date().toISOString()
  );

  insertIncident.run(
    "Public API",
    "Service restarted successfully",
    "low",
    new Date().toISOString()
  );
}

// ============================================================
// HELPERS
// ============================================================

function isValidSeverity(
  value: unknown
): value is string {
  return (
    value === "critical" ||
    value === "high" ||
    value === "medium" ||
    value === "low" ||
    value === "info"
  );
}

function isValidServiceStatus(
  value: unknown
): value is string {
  return (
    value === "online" ||
    value === "warning" ||
    value === "offline"
  );
}

// ============================================================
// ROOT
// ============================================================

app.get(
  "/",
  (_req, res) => {
    res.json({
      name: "DashboardU API",
      status: "running",
    });
  }
);

// ============================================================
// HEALTH
// ============================================================

app.get(
  "/api/health",
  (_req, res) => {
    res.json({
      status: "ok",
      timestamp:
        new Date().toISOString(),
    });
  }
);

// ============================================================
// SERVICES - GET
// ============================================================

app.get(
  "/api/services",
  (_req, res) => {
    const services = db
      .prepare(`
        SELECT
          id,
          name,
          status,
          response_time AS responseTime,
          uptime
        FROM services
        ORDER BY id ASC
      `)
      .all();

    res.json(
      services
    );
  }
);

// ============================================================
// SERVICES - CREATE
// ============================================================

app.post(
  "/api/services",
  (req, res) => {
    const {
      name,
      status,
      responseTime,
      uptime,
    } = req.body;

    if (
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          error:
            "Service name is required.",
        });
    }

    if (
      !isValidServiceStatus(
        status
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Status must be online, warning, or offline.",
        });
    }

    const parsedResponseTime =
      Number(responseTime);

    const parsedUptime =
      Number(uptime);

    if (
      !Number.isFinite(
        parsedResponseTime
      ) ||
      parsedResponseTime < 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Response time must be 0 or greater.",
        });
    }

    if (
      !Number.isFinite(
        parsedUptime
      ) ||
      parsedUptime < 0 ||
      parsedUptime > 100
    ) {
      return res
        .status(400)
        .json({
          error:
            "Uptime must be between 0 and 100.",
        });
    }

    const existing =
      db
        .prepare(`
          SELECT id
          FROM services
          WHERE LOWER(name) = LOWER(?)
        `)
        .get(
          name.trim()
        );

    if (existing) {
      return res
        .status(409)
        .json({
          error:
            "A service with this name already exists.",
        });
    }

    const result = db
      .prepare(`
        INSERT INTO services
        (
          name,
          status,
          response_time,
          uptime
        )
        VALUES (?, ?, ?, ?)
      `)
      .run(
        name.trim(),
        status,
        Math.round(
          parsedResponseTime
        ),
        parsedUptime
      );

    const service = db
      .prepare(`
        SELECT
          id,
          name,
          status,
          response_time AS responseTime,
          uptime
        FROM services
        WHERE id = ?
      `)
      .get(
        result.lastInsertRowid
      );

    return res
      .status(201)
      .json(service);
  }
);

// ============================================================
// SERVICES - UPDATE
// ============================================================

app.patch(
  "/api/services/:id",
  (req, res) => {
    const serviceId =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(
        serviceId
      ) ||
      serviceId <= 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid service ID.",
        });
    }

    const existingService =
      db
        .prepare(`
          SELECT
            id,
            name,
            status,
            response_time AS responseTime,
            uptime
          FROM services
          WHERE id = ?
        `)
        .get(
          serviceId
        ) as
        | {
            id: number;
            name: string;
            status: string;
            responseTime: number;
            uptime: number;
          }
        | undefined;

    if (
      !existingService
    ) {
      return res
        .status(404)
        .json({
          error:
            "Service not found.",
        });
    }

    const {
      status,
      responseTime,
      uptime,
    } = req.body;

    const nextStatus =
      status === undefined
        ? existingService.status
        : status;

    const nextResponseTime =
      responseTime ===
      undefined
        ? existingService.responseTime
        : Number(
            responseTime
          );

    const nextUptime =
      uptime === undefined
        ? existingService.uptime
        : Number(
            uptime
          );

    if (
      !isValidServiceStatus(
        nextStatus
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Status must be online, warning, or offline.",
        });
    }

    if (
      !Number.isFinite(
        nextResponseTime
      ) ||
      nextResponseTime < 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Response time must be 0 or greater.",
        });
    }

    if (
      !Number.isFinite(
        nextUptime
      ) ||
      nextUptime < 0 ||
      nextUptime > 100
    ) {
      return res
        .status(400)
        .json({
          error:
            "Uptime must be between 0 and 100.",
        });
    }

    db.prepare(`
      UPDATE services
      SET
        status = ?,
        response_time = ?,
        uptime = ?
      WHERE id = ?
    `).run(
      nextStatus,
      Math.round(
        nextResponseTime
      ),
      nextUptime,
      serviceId
    );

    const updatedService =
      db
        .prepare(`
          SELECT
            id,
            name,
            status,
            response_time AS responseTime,
            uptime
          FROM services
          WHERE id = ?
        `)
        .get(
          serviceId
        );

    return res.json(
      updatedService
    );
  }
);

// ============================================================
// SERVICES - DELETE
// ============================================================

app.delete(
  "/api/services/:id",
  (req, res) => {
    const serviceId =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(
        serviceId
      ) ||
      serviceId <= 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid service ID.",
        });
    }

    const existingService =
      db
        .prepare(`
          SELECT id
          FROM services
          WHERE id = ?
        `)
        .get(
          serviceId
        );

    if (
      !existingService
    ) {
      return res
        .status(404)
        .json({
          error:
            "Service not found.",
        });
    }

    db.prepare(`
      DELETE FROM services
      WHERE id = ?
    `).run(
      serviceId
    );

    return res.json({
      success: true,
    });
  }
);

// ============================================================
// INCIDENTS - ACTIVE
// ============================================================

app.get(
  "/api/incidents",
  (_req, res) => {
    const incidents =
      db
        .prepare(`
          SELECT
            id,
            service,
            title,
            severity,
            timestamp,
            status,
            resolved_at AS resolvedAt
          FROM incidents
          WHERE status = 'active'
          ORDER BY id DESC
        `)
        .all();

    res.json(
      incidents
    );
  }
);

// ============================================================
// INCIDENTS - HISTORY
// ============================================================

app.get(
  "/api/incidents/history",
  (_req, res) => {
    const incidents =
      db
        .prepare(`
          SELECT
            id,
            service,
            title,
            severity,
            timestamp,
            status,
            resolved_at AS resolvedAt
          FROM incidents
          ORDER BY id DESC
        `)
        .all();

    res.json(
      incidents
    );
  }
);

// ============================================================
// INCIDENTS - CREATE
// ============================================================

app.post(
  "/api/incidents",
  (req, res) => {
    const {
      service,
      title,
      severity,
    } = req.body;

    if (
      typeof service !==
        "string" ||
      service.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          error:
            "Service is required.",
        });
    }

    if (
      typeof title !==
        "string" ||
      title.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          error:
            "Incident title is required.",
        });
    }

    if (
      !isValidSeverity(
        severity
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Severity must be critical, high, medium, low, or info.",
        });
    }

    const existingService =
      db
        .prepare(`
          SELECT id
          FROM services
          WHERE name = ?
        `)
        .get(
          service.trim()
        );

    if (
      !existingService
    ) {
      return res
        .status(400)
        .json({
          error:
            "Selected service does not exist.",
        });
    }

    const timestamp =
      new Date().toISOString();

    const result = db
      .prepare(`
        INSERT INTO incidents
        (
          service,
          title,
          severity,
          timestamp,
          status
        )
        VALUES (?, ?, ?, ?, 'active')
      `)
      .run(
        service.trim(),
        title.trim(),
        severity,
        timestamp
      );

    const newIncident =
      db
        .prepare(`
          SELECT
            id,
            service,
            title,
            severity,
            timestamp,
            status,
            resolved_at AS resolvedAt
          FROM incidents
          WHERE id = ?
        `)
        .get(
          result.lastInsertRowid
        );

    return res
      .status(201)
      .json(
        newIncident
      );
  }
);

// ============================================================
// INCIDENTS - UPDATE
// ============================================================

app.patch(
  "/api/incidents/:id",
  (req, res) => {
    const incidentId =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(
        incidentId
      ) ||
      incidentId <= 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid incident ID.",
        });
    }

    const existing =
      db
        .prepare(`
          SELECT
            id,
            service,
            title,
            severity,
            timestamp,
            status,
            resolved_at AS resolvedAt
          FROM incidents
          WHERE id = ?
        `)
        .get(
          incidentId
        );

    if (!existing) {
      return res
        .status(404)
        .json({
          error:
            "Incident not found.",
        });
    }

    const {
      service,
      title,
      severity,
    } = req.body;

    if (
      typeof service !==
        "string" ||
      service.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          error:
            "Service is required.",
        });
    }

    if (
      typeof title !==
        "string" ||
      title.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          error:
            "Incident title is required.",
        });
    }

    if (
      !isValidSeverity(
        severity
      )
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid severity.",
        });
    }

    const existingService =
      db
        .prepare(`
          SELECT id
          FROM services
          WHERE name = ?
        `)
        .get(
          service.trim()
        );

    if (
      !existingService
    ) {
      return res
        .status(400)
        .json({
          error:
            "Selected service does not exist.",
        });
    }

    db.prepare(`
      UPDATE incidents
      SET
        service = ?,
        title = ?,
        severity = ?
      WHERE id = ?
    `).run(
      service.trim(),
      title.trim(),
      severity,
      incidentId
    );

    const updatedIncident =
      db
        .prepare(`
          SELECT
            id,
            service,
            title,
            severity,
            timestamp,
            status,
            resolved_at AS resolvedAt
          FROM incidents
          WHERE id = ?
        `)
        .get(
          incidentId
        );

    return res.json(
      updatedIncident
    );
  }
);

// ============================================================
// INCIDENTS - DELETE
// ============================================================

app.delete(
  "/api/incidents/:id",
  (req, res) => {
    const incidentId =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(
        incidentId
      ) ||
      incidentId <= 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid incident ID.",
        });
    }

    const existing =
      db
        .prepare(`
          SELECT id
          FROM incidents
          WHERE id = ?
        `)
        .get(
          incidentId
        );

    if (!existing) {
      return res
        .status(404)
        .json({
          error:
            "Incident not found.",
        });
    }

    db.prepare(`
      DELETE FROM incidents
      WHERE id = ?
    `).run(
      incidentId
    );

    return res.json({
      success: true,
    });
  }
);

// ============================================================
// INCIDENTS - RESOLVE
// ============================================================

app.patch(
  "/api/incidents/:id/resolve",
  (req, res) => {
    const incidentId =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(
        incidentId
      ) ||
      incidentId <= 0
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid incident ID.",
        });
    }

    const incident =
      db
        .prepare(`
          SELECT
            id,
            status
          FROM incidents
          WHERE id = ?
        `)
        .get(
          incidentId
        ) as
        | {
            id: number;
            status: string;
          }
        | undefined;

    if (!incident) {
      return res
        .status(404)
        .json({
          error:
            "Incident not found.",
        });
    }

    if (
      incident.status ===
      "resolved"
    ) {
      return res
        .status(409)
        .json({
          error:
            "Incident is already resolved.",
        });
    }

    const resolvedAt =
      new Date().toISOString();

    db.prepare(`
      UPDATE incidents
      SET
        status = 'resolved',
        resolved_at = ?
      WHERE id = ?
    `).run(
      resolvedAt,
      incidentId
    );

    const resolvedIncident =
      db
        .prepare(`
          SELECT
            id,
            service,
            title,
            severity,
            timestamp,
            status,
            resolved_at AS resolvedAt
          FROM incidents
          WHERE id = ?
        `)
        .get(
          incidentId
        );

    return res.json(
      resolvedIncident
    );
  }
);

// ============================================================
// OVERVIEW
// ============================================================

app.get(
  "/api/overview",
  (_req, res) => {
    const total = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM services
      `)
      .get() as {
      count: number;
    };

    const online = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM services
        WHERE status = 'online'
      `)
      .get() as {
      count: number;
    };

    const warning = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM services
        WHERE status = 'warning'
      `)
      .get() as {
      count: number;
    };

    const offline = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM services
        WHERE status = 'offline'
      `)
      .get() as {
      count: number;
    };

    const incidents = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM incidents
        WHERE status = 'active'
      `)
      .get() as {
      count: number;
    };

    const response = db
      .prepare(`
        SELECT AVG(response_time) AS average
        FROM services
        WHERE response_time > 0
      `)
      .get() as {
      average:
        | number
        | null;
    };

    const uptime = db
      .prepare(`
        SELECT AVG(uptime) AS average
        FROM services
      `)
      .get() as {
      average:
        | number
        | null;
    };

    res.json({
      totalServices:
        total.count,

      onlineServices:
        online.count,

      warningServices:
        warning.count,

      offlineServices:
        offline.count,

      activeIncidents:
        incidents.count,

      averageResponse:
        response.average ===
        null
          ? 0
          : Math.round(
              response.average
            ),

      averageUptime:
        uptime.average ===
        null
          ? 0
          : Number(
              uptime.average.toFixed(
                2
              )
            ),
    });
  }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");
    console.log(
      "DashboardU API"
    );

    console.log(
      "----------------------------"
    );

    console.log(
      `Port: ${PORT}`
    );

    console.log(
      `Database: ${DATABASE_PATH}`
    );

    console.log(
      `Allowed origins: ${CLIENT_ORIGINS.join(
        ", "
      )}`
    );

    console.log(
      `Health: /api/health`
    );

    console.log("");
  }
);