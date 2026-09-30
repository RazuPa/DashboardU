import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import CreateServiceModal from "./components/CreateServiceModal";
import EditIncidentModal from "./components/EditIncidentModal";
import EditServiceModal from "./components/EditServiceModal";
import IncidentDetailsModal from "./components/IncidentDetailsModal";
import PageHeader from "./components/PageHeader";
import ReportIncidentModal from "./components/ReportIncidentModal";
import ServiceDetailsModal from "./components/ServiceDetailsModal";
import Sidebar from "./components/Sidebar";

import AnalyticsPage from "./pages/AnalyticsPage";
import HistoryPage from "./pages/HistoryPage";
import IncidentsPage from "./pages/IncidentsPage";
import OverviewPage from "./pages/OverviewPage";
import ServicesPage from "./pages/ServicesPage";

import {
  createIncident,
  createService,
  deleteIncident,
  deleteService,
  getIncidentHistory,
  getIncidents,
  getOverview,
  getServices,
  resolveIncident,
  updateIncident,
  updateService,
} from "./services/dashboardApi";

import type {
  CreateServiceFormState,
  EditableServiceStatus,
  EditIncidentFormState,
  HistoryFilter,
  Incident,
  IncidentFilter,
  IncidentFormState,
  IncidentSeverity,
  Overview,
  Page,
  Service,
  ServiceFilter,
  ServiceFormState,
} from "./types/dashboard";

import {
  getIncidentDate,
  getResponseTime,
  normalizeServiceStatus,
  normalizeSeverity,
  parseUptime,
} from "./utils/dashboard";

import "./App.css";

const CHART_COLORS = {
  online: "#42cf84",
  warning: "#d9a93b",
  offline: "#e05b70",
  unknown: "#747b87",

  critical: "#e14860",
  high: "#e17439",
  medium: "#d8a939",
  low: "#4d97de",
  info: "#777e8b",

  active: "#d9a93b",
  resolved: "#42cf84",
};

function App() {
  const [
    page,
    setPage,
  ] =
    useState<Page>(
      "overview"
    );

  const [
    services,
    setServices,
  ] =
    useState<Service[]>(
      []
    );

  const [
    incidents,
    setIncidents,
  ] =
    useState<Incident[]>(
      []
    );

  const [
    incidentHistory,
    setIncidentHistory,
  ] =
    useState<Incident[]>(
      []
    );

  const [
    overview,
    setOverview,
  ] =
    useState<Overview | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    lastUpdated,
    setLastUpdated,
  ] =
    useState<Date | null>(
      null
    );

  const [
    serviceFilter,
    setServiceFilter,
  ] =
    useState<ServiceFilter>(
      "all"
    );

  const [
    incidentFilter,
    setIncidentFilter,
  ] =
    useState<IncidentFilter>(
      "all"
    );

  const [
    historyFilter,
    setHistoryFilter,
  ] =
    useState<HistoryFilter>(
      "all"
    );

  const [
    serviceSearch,
    setServiceSearch,
  ] =
    useState("");

  const [
    incidentSearch,
    setIncidentSearch,
  ] =
    useState("");

  const [
    historySearch,
    setHistorySearch,
  ] =
    useState("");

  const [
    reportOpen,
    setReportOpen,
  ] =
    useState(false);

  const [
    incidentForm,
    setIncidentForm,
  ] =
    useState<IncidentFormState>({
      service: "",
      title: "",
      severity:
        "medium",
    });

  const [
    submittingIncident,
    setSubmittingIncident,
  ] =
    useState(false);

  const [
    incidentFormError,
    setIncidentFormError,
  ] =
    useState<
      string | null
    >(null);

  const [
    incidentSuccess,
    setIncidentSuccess,
  ] =
    useState<
      string | null
    >(null);

  const [
    resolvingIncidentId,
    setResolvingIncidentId,
  ] =
    useState<
      number |
      string |
      null
    >(null);

  const [
    editingIncident,
    setEditingIncident,
  ] =
    useState<Incident | null>(
      null
    );

  const [
    editIncidentForm,
    setEditIncidentForm,
  ] =
    useState<EditIncidentFormState>({
      service: "",
      title: "",
      severity:
        "medium",
    });

  const [
    savingIncident,
    setSavingIncident,
  ] =
    useState(false);

  const [
    editIncidentError,
    setEditIncidentError,
  ] =
    useState<
      string | null
    >(null);

  const [
    editIncidentSuccess,
    setEditIncidentSuccess,
  ] =
    useState<
      string | null
    >(null);

  const [
    deletingIncidentId,
    setDeletingIncidentId,
  ] =
    useState<
      number |
      string |
      null
    >(null);

  const [
    editingService,
    setEditingService,
  ] =
    useState<Service | null>(
      null
    );

  const [
    serviceForm,
    setServiceForm,
  ] =
    useState<ServiceFormState>({
      name: "",
      status:
        "online",
      responseTime:
        "0",
      uptime:
        "100",
    });

  const [
    savingService,
    setSavingService,
  ] =
    useState(false);

  const [
    serviceFormError,
    setServiceFormError,
  ] =
    useState<
      string | null
    >(null);

  const [
    serviceSuccess,
    setServiceSuccess,
  ] =
    useState<
      string | null
    >(null);

  const [
    createServiceOpen,
    setCreateServiceOpen,
  ] =
    useState(false);

  const [
    createServiceForm,
    setCreateServiceForm,
  ] =
    useState<CreateServiceFormState>({
      name: "",
      status:
        "online",
      responseTime:
        "0",
      uptime:
        "100",
    });

  const [
    creatingService,
    setCreatingService,
  ] =
    useState(false);

  const [
    createServiceError,
    setCreateServiceError,
  ] =
    useState<
      string | null
    >(null);

  const [
    createServiceSuccess,
    setCreateServiceSuccess,
  ] =
    useState<
      string | null
    >(null);

  const [
    deletingServiceId,
    setDeletingServiceId,
  ] =
    useState<
      number |
      string |
      null
    >(null);

  const [
    selectedService,
    setSelectedService,
  ] =
    useState<Service | null>(
      null
    );

  const [
    selectedIncident,
    setSelectedIncident,
  ] =
    useState<Incident | null>(
      null
    );

  const loadDashboard =
    useCallback(
      async (
        manualRefresh =
          false
      ) => {
        try {
          if (
            manualRefresh
          ) {
            setRefreshing(
              true
            );
          }

          setError(null);

          const [
            servicesData,
            incidentsData,
            historyData,
            overviewData,
          ] =
            await Promise.all([
              getServices(),
              getIncidents(),
              getIncidentHistory(),
              getOverview(),
            ]);

          setServices(
            servicesData
          );

          setIncidents(
            incidentsData
          );

          setIncidentHistory(
            historyData
          );

          setOverview(
            overviewData
          );

          setLastUpdated(
            new Date()
          );
        } catch (err) {
          console.error(
            "Dashboard load failed:",
            err
          );

          setError(
            err instanceof
              Error
              ? err.message
              : "Could not load DashboardU data."
          );
        } finally {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void loadDashboard();

    const interval =
      window.setInterval(
        () => {
          void loadDashboard();
        },
        10000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    loadDashboard,
  ]);

  useEffect(() => {
    if (
      reportOpen &&
      incidentForm.service ===
        "" &&
      services.length >
        0
    ) {
      setIncidentForm(
        (current) => ({
          ...current,

          service:
            services[0]
              .name,
        })
      );
    }
  }, [
    reportOpen,
    incidentForm.service,
    services,
  ]);

  async function handleReportIncident(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const title =
      incidentForm.title.trim();

    const service =
      incidentForm.service.trim();

    if (!service) {
      setIncidentFormError(
        "Please select a service."
      );

      return;
    }

    if (!title) {
      setIncidentFormError(
        "Please enter an incident title."
      );

      return;
    }

    try {
      setSubmittingIncident(
        true
      );

      setIncidentFormError(
        null
      );

      setIncidentSuccess(
        null
      );

      await createIncident({
        ...incidentForm,
        service,
        title,
      });

      setIncidentForm({
        service:
          services[0]
            ?.name ??
          "",

        title: "",

        severity:
          "medium",
      });

      setIncidentSuccess(
        "Incident reported successfully."
      );

      await loadDashboard(
        true
      );

      window.setTimeout(
        () => {
          setReportOpen(
            false
          );

          setIncidentSuccess(
            null
          );
        },
        700
      );
    } catch (err) {
      setIncidentFormError(
        err instanceof
          Error
          ? err.message
          : "Could not report incident."
      );
    } finally {
      setSubmittingIncident(
        false
      );
    }
  }

  async function handleResolveIncident(
    incident:
      Incident
  ) {
    const incidentName =
      incident.title ??
      incident.name ??
      "this incident";

    const confirmed =
      window.confirm(
        `Resolve "${incidentName}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setResolvingIncidentId(
        incident.id
      );

      setError(null);

      const resolved =
        await resolveIncident(
          incident.id
        );

      if (
        selectedIncident
          ?.id ===
        incident.id
      ) {
        setSelectedIncident(
          resolved
        );
      }

      await loadDashboard(
        true
      );
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Could not resolve incident."
      );
    } finally {
      setResolvingIncidentId(
        null
      );
    }
  }

  function openEditIncident(
    incident:
      Incident
  ) {
    const severity =
      normalizeSeverity(
        incident.severity
      );

    setEditingIncident(
      incident
    );

    setEditIncidentForm({
      service:
        incident.service ??
        incident.serviceName ??
        services[0]
          ?.name ??
        "",

      title:
        incident.title ??
        incident.name ??
        "",

      severity:
        severity ===
        "unknown"
          ? "medium"
          : severity,
    });

    setEditIncidentError(
      null
    );

    setEditIncidentSuccess(
      null
    );
  }

  async function handleSaveIncident(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !editingIncident
    ) {
      return;
    }

    const service =
      editIncidentForm.service.trim();

    const title =
      editIncidentForm.title.trim();

    if (!service) {
      setEditIncidentError(
        "Please select a service."
      );

      return;
    }

    if (!title) {
      setEditIncidentError(
        "Incident title is required."
      );

      return;
    }

    try {
      setSavingIncident(
        true
      );

      setEditIncidentError(
        null
      );

      setEditIncidentSuccess(
        null
      );

      const updated =
        await updateIncident(
          editingIncident.id,
          {
            ...editIncidentForm,

            service,

            title,
          }
        );

      if (
        selectedIncident
          ?.id ===
        editingIncident.id
      ) {
        setSelectedIncident(
          updated
        );
      }

      setEditIncidentSuccess(
        "Incident updated successfully."
      );

      await loadDashboard(
        true
      );

      window.setTimeout(
        () => {
          setEditingIncident(
            null
          );

          setEditIncidentSuccess(
            null
          );
        },
        650
      );
    } catch (err) {
      setEditIncidentError(
        err instanceof
          Error
          ? err.message
          : "Could not update incident."
      );
    } finally {
      setSavingIncident(
        false
      );
    }
  }

  async function handleDeleteIncident(
    incident:
      Incident
  ) {
    const name =
      incident.title ??
      incident.name ??
      `#${incident.id}`;

    const confirmed =
      window.confirm(
        `Delete "${name}" permanently?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingIncidentId(
        incident.id
      );

      setError(null);

      await deleteIncident(
        incident.id
      );

      if (
        selectedIncident
          ?.id ===
        incident.id
      ) {
        setSelectedIncident(
          null
        );
      }

      if (
        editingIncident
          ?.id ===
        incident.id
      ) {
        setEditingIncident(
          null
        );
      }

      await loadDashboard(
        true
      );
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Could not delete incident."
      );
    } finally {
      setDeletingIncidentId(
        null
      );
    }
  }

  async function handleCreateService(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const name =
      createServiceForm.name.trim();

    const responseTime =
      Number(
        createServiceForm.responseTime
      );

    const uptime =
      Number(
        createServiceForm.uptime
      );

    if (!name) {
      setCreateServiceError(
        "Service name is required."
      );

      return;
    }

    if (
      !Number.isFinite(
        responseTime
      ) ||
      responseTime <
        0
    ) {
      setCreateServiceError(
        "Response time must be 0 or greater."
      );

      return;
    }

    if (
      !Number.isFinite(
        uptime
      ) ||
      uptime < 0 ||
      uptime > 100
    ) {
      setCreateServiceError(
        "Uptime must be between 0 and 100."
      );

      return;
    }

    try {
      setCreatingService(
        true
      );

      setCreateServiceError(
        null
      );

      setCreateServiceSuccess(
        null
      );

      await createService({
        ...createServiceForm,

        name,
      });

      setCreateServiceSuccess(
        "Service created successfully."
      );

      await loadDashboard(
        true
      );

      window.setTimeout(
        () => {
          setCreateServiceOpen(
            false
          );

          setCreateServiceForm({
            name: "",

            status:
              "online",

            responseTime:
              "0",

            uptime:
              "100",
          });

          setCreateServiceSuccess(
            null
          );
        },
        650
      );
    } catch (err) {
      setCreateServiceError(
        err instanceof
          Error
          ? err.message
          : "Could not create service."
      );
    } finally {
      setCreatingService(
        false
      );
    }
  }

  async function handleDeleteService(
    service:
      Service
  ) {
    const confirmed =
      window.confirm(
        `Delete "${service.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingServiceId(
        service.id
      );

      setError(null);

      await deleteService(
        service.id
      );

      if (
        selectedService
          ?.id ===
        service.id
      ) {
        setSelectedService(
          null
        );
      }

      await loadDashboard(
        true
      );
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Could not delete service."
      );
    } finally {
      setDeletingServiceId(
        null
      );
    }
  }

  function openEditService(
    service:
      Service
  ) {
    const normalized =
      normalizeServiceStatus(
        service.status
      );

    const editableStatus:
      EditableServiceStatus =
      normalized ===
      "unknown"
        ? "online"
        : normalized;

    setEditingService(
      service
    );

    setServiceForm({
      name:
        service.name,

      status:
        editableStatus,

      responseTime:
        String(
          getResponseTime(
            service
          )
        ),

      uptime:
        String(
          parseUptime(
            service.uptime
          ) ?? 100
        ),
    });

    setServiceFormError(
      null
    );

    setServiceSuccess(
      null
    );
  }

  async function handleSaveService(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !editingService
    ) {
      return;
    }

    const name =
      serviceForm.name.trim();

    const responseTime =
      Number(
        serviceForm.responseTime
      );

    const uptime =
      Number(
        serviceForm.uptime
      );

    if (!name) {
      setServiceFormError(
        "Service name is required."
      );

      return;
    }

    if (
      !Number.isFinite(
        responseTime
      ) ||
      responseTime <
        0
    ) {
      setServiceFormError(
        "Response time must be 0 or greater."
      );

      return;
    }

    if (
      !Number.isFinite(
        uptime
      ) ||
      uptime < 0 ||
      uptime > 100
    ) {
      setServiceFormError(
        "Uptime must be between 0 and 100."
      );

      return;
    }

    try {
      setSavingService(
        true
      );

      setServiceFormError(
        null
      );

      setServiceSuccess(
        null
      );

      const updatedService =
        await updateService(
          editingService.id,
          {
            ...serviceForm,

            name,
          }
        );

      setServiceSuccess(
        "Service updated successfully."
      );

      setSelectedService(
        (current) =>
          current?.id ===
          editingService.id
            ? updatedService
            : current
      );

      await loadDashboard(
        true
      );

      window.setTimeout(
        () => {
          setEditingService(
            null
          );

          setServiceSuccess(
            null
          );
        },
        650
      );
    } catch (err) {
      setServiceFormError(
        err instanceof
          Error
          ? err.message
          : "Could not update service."
      );
    } finally {
      setSavingService(
        false
      );
    }
  }

  const onlineServices =
    useMemo(
      () =>
        services.filter(
          (service) =>
            normalizeServiceStatus(
              service.status
            ) ===
            "online"
        ).length,
      [
        services,
      ]
    );

  const warningServices =
    useMemo(
      () =>
        services.filter(
          (service) =>
            normalizeServiceStatus(
              service.status
            ) ===
            "warning"
        ).length,
      [
        services,
      ]
    );

  const offlineServices =
    useMemo(
      () =>
        services.filter(
          (service) =>
            normalizeServiceStatus(
              service.status
            ) ===
            "offline"
        ).length,
      [
        services,
      ]
    );

  const unknownServices =
    useMemo(
      () =>
        services.filter(
          (service) =>
            normalizeServiceStatus(
              service.status
            ) ===
            "unknown"
        ).length,
      [
        services,
      ]
    );

  const averageResponseTime =
    useMemo(() => {
      if (
        services.length ===
        0
      ) {
        return 0;
      }

      const total =
        services.reduce(
          (
            sum,
            service
          ) =>
            sum +
            getResponseTime(
              service
            ),
          0
        );

      return Math.round(
        total /
          services.length
      );
    }, [
      services,
    ]);

  const averageUptime =
    useMemo(() => {
      const values =
        services
          .map(
            (
              service
            ) =>
              parseUptime(
                service.uptime
              )
          )
          .filter(
            (
              value
            ): value is number =>
              value !==
              null
          );

      if (
        values.length ===
        0
      ) {
        return 0;
      }

      return (
        values.reduce(
          (
            total,
            value
          ) =>
            total +
            value,
          0
        ) /
        values.length
      );
    }, [
      services,
    ]);

  const availability =
    useMemo(() => {
      if (
        services.length ===
        0
      ) {
        return 0;
      }

      return Math.round(
        (onlineServices /
          services.length) *
          100
      );
    }, [
      onlineServices,
      services.length,
    ]);

  const criticalIncidents =
    useMemo(
      () =>
        incidents.filter(
          (incident) =>
            normalizeSeverity(
              incident.severity
            ) ===
            "critical"
        ).length,
      [
        incidents,
      ]
    );

  const highIncidents =
    useMemo(
      () =>
        incidents.filter(
          (incident) =>
            normalizeSeverity(
              incident.severity
            ) ===
            "high"
        ).length,
      [
        incidents,
      ]
    );

  const affectedServices =
    useMemo(() => {
      const names =
        incidents
          .map(
            (
              incident
            ) =>
              incident.service ??
              incident.serviceName
          )
          .filter(
            (
              value
            ): value is string =>
              Boolean(
                value
              )
          );

      return new Set(
        names
      ).size;
    }, [
      incidents,
    ]);

  const resolvedCount =
    useMemo(
      () =>
        incidentHistory.filter(
          (incident) =>
            incident.status ===
            "resolved"
        ).length,
      [
        incidentHistory,
      ]
    );

  const sortedIncidents =
    useMemo(
      () =>
        [
          ...incidents,
        ].sort(
          (
            a,
            b
          ) =>
            getIncidentDate(
              b
            ) -
            getIncidentDate(
              a
            )
        ),
      [
        incidents,
      ]
    );

  const selectedServiceIncidents =
    useMemo(() => {
      if (
        !selectedService
      ) {
        return [];
      }

      return incidentHistory.filter(
        (incident) =>
          (
            incident.service ??
            incident.serviceName
          ) ===
          selectedService.name
      );
    }, [
      selectedService,
      incidentHistory,
    ]);

  const selectedServiceActiveCount =
    useMemo(
      () =>
        selectedServiceIncidents.filter(
          (incident) =>
            incident.status ===
            "active"
        ).length,
      [
        selectedServiceIncidents,
      ]
    );

  const selectedServiceResolvedCount =
    useMemo(
      () =>
        selectedServiceIncidents.filter(
          (incident) =>
            incident.status ===
            "resolved"
        ).length,
      [
        selectedServiceIncidents,
      ]
    );

  const selectedIncidentService =
    useMemo(() => {
      if (
        !selectedIncident
      ) {
        return null;
      }

      const serviceName =
        selectedIncident.service ??
        selectedIncident.serviceName;

      if (
        !serviceName
      ) {
        return null;
      }

      return (
        services.find(
          (service) =>
            service.name ===
            serviceName
        ) ?? null
      );
    }, [
      selectedIncident,
      services,
    ]);

  const filteredServices =
    useMemo(() => {
      const search =
        serviceSearch
          .trim()
          .toLowerCase();

      return services.filter(
        (service) => {
          const status =
            normalizeServiceStatus(
              service.status
            );

          return (
            (
              serviceFilter ===
                "all" ||
              status ===
                serviceFilter
            ) &&
            (
              search.length ===
                0 ||
              service.name
                .toLowerCase()
                .includes(
                  search
                )
            )
          );
        }
      );
    }, [
      services,
      serviceFilter,
      serviceSearch,
    ]);

  const filteredIncidents =
    useMemo(() => {
      const search =
        incidentSearch
          .trim()
          .toLowerCase();

      return sortedIncidents.filter(
        (incident) => {
          const severity =
            normalizeSeverity(
              incident.severity
            );

          const title =
            incident.title ??
            "";

          const service =
            incident.service ??
            "";

          return (
            (
              incidentFilter ===
                "all" ||
              severity ===
                incidentFilter
            ) &&
            (
              search.length ===
                0 ||
              title
                .toLowerCase()
                .includes(
                  search
                ) ||
              service
                .toLowerCase()
                .includes(
                  search
                )
            )
          );
        }
      );
    }, [
      sortedIncidents,
      incidentFilter,
      incidentSearch,
    ]);

  const filteredHistory =
    useMemo(() => {
      const search =
        historySearch
          .trim()
          .toLowerCase();

      return incidentHistory.filter(
        (incident) => {
          const title =
            incident.title ??
            "";

          const service =
            incident.service ??
            "";

          return (
            (
              historyFilter ===
                "all" ||
              incident.status ===
                historyFilter
            ) &&
            (
              search.length ===
                0 ||
              title
                .toLowerCase()
                .includes(
                  search
                ) ||
              service
                .toLowerCase()
                .includes(
                  search
                )
            )
          );
        }
      );
    }, [
      incidentHistory,
      historyFilter,
      historySearch,
    ]);

  const serviceHealthData =
    useMemo(
      () =>
        [
          {
            name:
              "Online",
            value:
              onlineServices,
            color:
              CHART_COLORS.online,
          },

          {
            name:
              "Warning",
            value:
              warningServices,
            color:
              CHART_COLORS.warning,
          },

          {
            name:
              "Offline",
            value:
              offlineServices,
            color:
              CHART_COLORS.offline,
          },

          {
            name:
              "Unknown",
            value:
              unknownServices,
            color:
              CHART_COLORS.unknown,
          },
        ].filter(
          (item) =>
            item.value >
            0
        ),
      [
        onlineServices,
        warningServices,
        offlineServices,
        unknownServices,
      ]
    );

  const responseTimeData =
    useMemo(
      () =>
        [
          ...services,
        ]
          .sort(
            (
              a,
              b
            ) =>
              getResponseTime(
                b
              ) -
              getResponseTime(
                a
              )
          )
          .map(
            (
              service
            ) => ({
              name:
                service.name,

              responseTime:
                getResponseTime(
                  service
                ),
            })
          ),
      [
        services,
      ]
    );

  const severityData =
    useMemo(() => {
      const counters: Record<
        IncidentSeverity,
        number
      > = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
        unknown: 0,
      };

      incidentHistory.forEach(
        (incident) => {
          counters[
            normalizeSeverity(
              incident.severity
            )
          ] += 1;
        }
      );

      return [
        {
          name:
            "Critical",

          count:
            counters.critical,

          color:
            CHART_COLORS.critical,
        },

        {
          name:
            "High",

          count:
            counters.high,

          color:
            CHART_COLORS.high,
        },

        {
          name:
            "Medium",

          count:
            counters.medium,

          color:
            CHART_COLORS.medium,
        },

        {
          name:
            "Low",

          count:
            counters.low,

          color:
            CHART_COLORS.low,
        },

        {
          name:
            "Info",

          count:
            counters.info,

          color:
            CHART_COLORS.info,
        },
      ].filter(
        (item) =>
          item.count >
          0
      );
    }, [
      incidentHistory,
    ]);

  const incidentStatusData =
    useMemo(
      () =>
        [
          {
            name:
              "Active",

            value:
              incidents.length,

            color:
              CHART_COLORS.active,
          },

          {
            name:
              "Resolved",

            value:
              resolvedCount,

            color:
              CHART_COLORS.resolved,
          },
        ].filter(
          (item) =>
            item.value >
            0
        ),
      [
        incidents.length,
        resolvedCount,
      ]
    );

  const pageInfo: Record<
    Page,
    {
      eyebrow: string;
      title: string;
      subtitle: string;
    }
  > = {
    overview: {
      eyebrow:
        "OPERATIONS CENTER",

      title:
        "System Overview",

      subtitle:
        "Monitor services and incidents in real time.",
    },

    services: {
      eyebrow:
        "INFRASTRUCTURE",

      title:
        "Services",

      subtitle:
        "Monitor and manage every connected service.",
    },

    incidents: {
      eyebrow:
        "INCIDENT MANAGEMENT",

      title:
        "Incidents",

      subtitle:
        "Review and resolve active system incidents.",
    },

    history: {
      eyebrow:
        "INCIDENT MANAGEMENT",

      title:
        "Incident History",

      subtitle:
        "Review active and resolved incidents.",
    },

    analytics: {
      eyebrow:
        "SYSTEM INTELLIGENCE",

      title:
        "Analytics",

      subtitle:
        "Visualize infrastructure performance and incident data.",
    },
  };

  const currentPage =
    pageInfo[
      page
    ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div>
          <div className="loading-logo">
            D
          </div>

          <p>
            Loading DashboardU...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        page={
          page
        }
        onChangePage={
          setPage
        }
      />

      <main className="main-content">
        <PageHeader
          eyebrow={
            currentPage.eyebrow
          }
          title={
            currentPage.title
          }
          subtitle={
            currentPage.subtitle
          }
          lastUpdated={
            lastUpdated
          }
          refreshing={
            refreshing
          }
          showReportIncident={
            page ===
            "incidents"
          }
          onRefresh={() =>
            void loadDashboard(
              true
            )
          }
          onReportIncident={() => {
            setIncidentFormError(
              null
            );

            setIncidentSuccess(
              null
            );

            setReportOpen(
              true
            );
          }}
        />

        {error && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">
                  CONNECTION
                </span>

                <h3>
                  Data Error
                </h3>
              </div>
            </div>

            <div className="panel-body">
              <p>
                {error}
              </p>
            </div>
          </section>
        )}

        {page ===
          "overview" && (
          <OverviewPage
            services={
              services
            }
            incidents={
              sortedIncidents
            }
            overview={
              overview
            }
            resolvingIncidentId={
              resolvingIncidentId
            }
            onServiceDetails={
              setSelectedService
            }
            onEditService={
              openEditService
            }
            onIncidentDetails={
              setSelectedIncident
            }
            onResolveIncident={(
              incident
            ) =>
              void handleResolveIncident(
                incident
              )
            }
          />
        )}

        {page ===
          "services" && (
          <ServicesPage
            services={
              services
            }
            filteredServices={
              filteredServices
            }
            onlineServices={
              onlineServices
            }
            warningServices={
              warningServices
            }
            offlineServices={
              offlineServices
            }
            serviceSearch={
              serviceSearch
            }
            serviceFilter={
              serviceFilter
            }
            deletingServiceId={
              deletingServiceId
            }
            onSearchChange={
              setServiceSearch
            }
            onFilterChange={
              setServiceFilter
            }
            onServiceDetails={
              setSelectedService
            }
            onEditService={
              openEditService
            }
            onCreateService={() => {
              setCreateServiceError(
                null
              );

              setCreateServiceSuccess(
                null
              );

              setCreateServiceForm({
                name:
                  "",

                status:
                  "online",

                responseTime:
                  "0",

                uptime:
                  "100",
              });

              setCreateServiceOpen(
                true
              );
            }}
            onDeleteService={(
              service
            ) =>
              void handleDeleteService(
                service
              )
            }
          />
        )}

        {page ===
          "incidents" && (
          <IncidentsPage
            incidents={
              incidents
            }
            filteredIncidents={
              filteredIncidents
            }
            criticalIncidents={
              criticalIncidents
            }
            highIncidents={
              highIncidents
            }
            affectedServices={
              affectedServices
            }
            incidentSearch={
              incidentSearch
            }
            incidentFilter={
              incidentFilter
            }
            resolvingIncidentId={
              resolvingIncidentId
            }
            deletingIncidentId={
              deletingIncidentId
            }
            onSearchChange={
              setIncidentSearch
            }
            onFilterChange={
              setIncidentFilter
            }
            onIncidentDetails={
              setSelectedIncident
            }
            onResolveIncident={(
              incident
            ) =>
              void handleResolveIncident(
                incident
              )
            }
            onEditIncident={
              openEditIncident
            }
            onDeleteIncident={(
              incident
            ) =>
              void handleDeleteIncident(
                incident
              )
            }
          />
        )}

        {page ===
          "history" && (
          <HistoryPage
            incidents={
              incidentHistory
            }
            filteredHistory={
              filteredHistory
            }
            activeCount={
              incidents.length
            }
            resolvedCount={
              resolvedCount
            }
            historySearch={
              historySearch
            }
            historyFilter={
              historyFilter
            }
            onSearchChange={
              setHistorySearch
            }
            onFilterChange={
              setHistoryFilter
            }
            onIncidentDetails={
              setSelectedIncident
            }
          />
        )}

        {page ===
          "analytics" && (
          <AnalyticsPage
            averageUptime={
              averageUptime
            }
            averageResponseTime={
              averageResponseTime
            }
            availability={
              availability
            }
            activeIncidents={
              incidents.length
            }
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
        )}
      </main>

      {selectedIncident && (
        <IncidentDetailsModal
          incident={
            selectedIncident
          }
          relatedService={
            selectedIncidentService
          }
          resolving={
            resolvingIncidentId ===
            selectedIncident.id
          }
          deleting={
            deletingIncidentId ===
            selectedIncident.id
          }
          onClose={() =>
            setSelectedIncident(
              null
            )
          }
          onViewService={(
            service
          ) => {
            setSelectedIncident(
              null
            );

            setSelectedService(
              service
            );
          }}
          onResolve={(
            incident
          ) =>
            void handleResolveIncident(
              incident
            )
          }
          onEdit={(
            incident
          ) => {
            setSelectedIncident(
              null
            );

            openEditIncident(
              incident
            );
          }}
          onDelete={(
            incident
          ) =>
            void handleDeleteIncident(
              incident
            )
          }
        />
      )}

      {selectedService && (
        <ServiceDetailsModal
          service={
            selectedService
          }
          incidents={
            selectedServiceIncidents
          }
          activeCount={
            selectedServiceActiveCount
          }
          resolvedCount={
            selectedServiceResolvedCount
          }
          onClose={() =>
            setSelectedService(
              null
            )
          }
          onEdit={(
            service
          ) => {
            setSelectedService(
              null
            );

            openEditService(
              service
            );
          }}
          onViewIncident={(
            incident
          ) => {
            setSelectedService(
              null
            );

            setSelectedIncident(
              incident
            );
          }}
        />
      )}

      {reportOpen && (
        <ReportIncidentModal
          services={
            services
          }
          form={
            incidentForm
          }
          submitting={
            submittingIncident
          }
          error={
            incidentFormError
          }
          success={
            incidentSuccess
          }
          onClose={() =>
            setReportOpen(
              false
            )
          }
          onChange={
            setIncidentForm
          }
          onSubmit={
            handleReportIncident
          }
        />
      )}

      {editingIncident && (
        <EditIncidentModal
          incident={
            editingIncident
          }
          services={
            services
          }
          form={
            editIncidentForm
          }
          saving={
            savingIncident
          }
          error={
            editIncidentError
          }
          success={
            editIncidentSuccess
          }
          onClose={() =>
            setEditingIncident(
              null
            )
          }
          onChange={
            setEditIncidentForm
          }
          onSubmit={
            handleSaveIncident
          }
        />
      )}

      {editingService && (
        <EditServiceModal
          service={
            editingService
          }
          form={
            serviceForm
          }
          saving={
            savingService
          }
          error={
            serviceFormError
          }
          success={
            serviceSuccess
          }
          onClose={() =>
            setEditingService(
              null
            )
          }
          onChange={
            setServiceForm
          }
          onSubmit={
            handleSaveService
          }
        />
      )}

      {createServiceOpen && (
        <CreateServiceModal
          form={
            createServiceForm
          }
          saving={
            creatingService
          }
          error={
            createServiceError
          }
          success={
            createServiceSuccess
          }
          onClose={() =>
            setCreateServiceOpen(
              false
            )
          }
          onChange={
            setCreateServiceForm
          }
          onSubmit={
            handleCreateService
          }
        />
      )}
    </div>
  );
}

export default App;