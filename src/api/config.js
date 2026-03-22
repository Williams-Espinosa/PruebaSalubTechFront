export const API = {
  BASE_URL: "http://localhost:3000",

  AUTH: {
    LOGIN:    "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    FIREBASE: "/api/v1/auth/firebase",
  },

  USUARIOS: {
    LIST:   "/api/v1/usuarios",
    BY_ID:  "/api/v1/usuarios/:id",
    UPDATE: "/api/v1/usuarios/:id",
    DELETE: "/api/v1/usuarios/:id",
    TURNOS: "/api/v1/usuarios/:id/turnos",
  },

  PACIENTES: {
    LIST:    "/api/v1/pacientes",
    BY_ID:   "/api/v1/pacientes/:id",
    CREATE:  "/api/v1/pacientes",
    UPDATE:  "/api/v1/pacientes/:id",
    DELETE:  "/api/v1/pacientes/:id",
    HANDOFF: "/api/v1/pacientes/:id/handoff",  // ?horas=N (default 12)
  },

  NOTAS: {
    LIST:   "/api/v1/notas",
    BY_ID:  "/api/v1/notas/:id",
    CREATE: "/api/v1/notas",
  },

  TAREAS: {
    LIST:          "/api/v1/tareas",            // ?estado=pendiente|completada
    BY_ID:         "/api/v1/tareas/:id",
    CREATE:        "/api/v1/tareas",
    TOGGLE_ESTADO: "/api/v1/tareas/:id/estado", // PATCH — body vacío = toggle
    DELETE:        "/api/v1/tareas/:id",
  },

  TURNOS: {
    LIST:      "/api/v1/turnos",
    INICIAR:   "/api/v1/turnos/iniciar",
    FINALIZAR: "/api/v1/turnos/:id/finalizar",
  },

  HABITACIONES: {
    LIST:          "/api/v1/habitaciones",
    BY_ID:         "/api/v1/habitaciones/:id",
    CREATE:        "/api/v1/habitaciones",
    UPDATE:        "/api/v1/habitaciones/:id",
    UPDATE_ESTADO: "/api/v1/habitaciones/:id/estado",
    PACIENTES:     "/api/v1/habitaciones/:id/pacientes",
  },

  RH: {
    EXPORT_XLS:   "/api/v1/rh/exportar/xls",
    EXPORT_PDF:   "/api/v1/rh/exportar/pdf",
    AUDITORIA_INC:"/api/v1/rh/auditoria/incidentes",
  },
};
