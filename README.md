# SaludTech — Hospital Management System

Sistema de gestión inteligente de cambios de turno hospitalario.

---

## Estructura del proyecto (Atomic Design)

```
saludtech/
├── index.html
├── package.json
├── vite.config.js
├── build/
│   ├── generateExports.js   ← script Node que genera exportFiles.js
│   └── generateFiles.py     ← script Python que genera .xlsx y .pdf
└── src/
    ├── main.jsx             ← entry point React
    ├── App.jsx              ← router raíz
    │
    ├── api/
    │   ├── config.js        ← 🔌 ENDPOINTS — edita BASE_URL aquí
    │   └── client.js        ← apiFetch() helper autenticado
    │
    ├── hooks/
    │   └── useTimer.js      ← countdown hook
    │
    ├── styles/
    │   └── globalStyle.js   ← CSS variables + animaciones
    │
    ├── constants/
    │   ├── mockData.js      ← datos de prueba (reemplazar con API calls)
    │   └── exportFiles.js   ← base64 de xlsx/pdf (auto-generado)
    │
    └── components/
        │
        ├── atoms/           ← unidades mínimas, sin estado propio
        │   ├── Icons.jsx    ← todos los SVG del sistema
        │   ├── Button.jsx   ← botón reutilizable (variantes)
        │   ├── Badge.jsx    ← etiqueta de estado/prioridad
        │   ├── Input.jsx    ← input con icono opcional
        │   └── Avatar.jsx   ← iniciales sobre fondo de color
        │
        ├── molecules/       ← combinaciones de átomos
        │   ├── PatientCard.jsx  ← tarjeta de paciente con botón Atender
        │   ├── TaskItem.jsx     ← ítem de tarea con checkbox
        │   └── Modal.jsx        ← overlay modal genérico
        │
        ├── organisms/       ← secciones completas de UI
        │   ├── Sidebar.jsx      ← barra lateral (plana o por secciones)
        │   ├── Topbar.jsx       ← barra superior con búsqueda y avatar
        │   └── CookieBanner.jsx ← banner de cookies
        │
        ├── templates/       ← layouts reutilizables
        │   ├── DashboardLayout.jsx  ← sidebar + topbar + slot de contenido
        │   └── LandingLayout.jsx    ← navbar pública + slot de contenido
        │
        └── pages/
            ├── public/
            │   ├── HeroPage.jsx      ← landing con cookie banner
            │   ├── ProfilePage.jsx   ← selección de perfil
            │   ├── LoginPage.jsx     ← formulario de login
            │   └── PrivacyPage.jsx   ← políticas de privacidad
            │
            ├── enfermero/
            │   ├── EnfermeroApp.jsx  ← shell + router del dashboard
            │   ├── DashboardHome.jsx ← resumen turno, pacientes, tareas
            │   ├── RegistrosPage.jsx ← registro de incidentes y notas
            │   └── EntregaTurnoPage.jsx ← checklist entrega de turno
            │
            ├── supervisor/
            │   ├── SupervisorApp.jsx    ← shell + router
            │   ├── SupDashHome.jsx      ← panel de control general
            │   ├── ValidarGuardia.jsx   ← validar cierre de guardia
            │   ├── SupRegistros.jsx     ← tabla de pacientes
            │   └── SupEntregaTurno.jsx  ← entrega documentada
            │
            └── rh/
                ├── RhApp.jsx           ← shell + router
                ├── RhPersonal.jsx      ← gestión de colaboradores + modal
                ├── RhAuditoria.jsx     ← incidentes y auditoría (2 tabs)
                ├── RhDashHome.jsx      ← KPIs + gráfica + alertas
                ├── RhRegistros.jsx     ← bitácora técnica + exportar XLS
                └── RhEntregaTurno.jsx  ← turnos + modal nueva entrega
```

---

## Instalación y desarrollo

```bash
# Si ya hiciste npm install antes, borra primero node_modules
rm -rf node_modules package-lock.json

npm install
npm run dev          # servidor en http://localhost:3000
```

> **Requiere Node.js ≥ 18.**  
> Usa Vite 6 + `@vitejs/plugin-react-oxc` (compilador OXC, sin warnings).  
> Si tienes Vite 8 instalado globalmente y prefieres no cambiar, instala manualmente:
> ```bash
> npm install @vitejs/plugin-react-oxc vite
> ```

## Generar archivos de exportación (XLS/PDF)

```bash
pip install openpyxl reportlab
npm run generate-exports
```

Esto ejecuta `build/generateFiles.py`, genera los archivos binarios y escribe
`src/constants/exportFiles.js` con el base64 listo para usar en el frontend.

---

## Conectar el backend

### 1 — Editar la URL base

```js
// src/api/config.js
BASE_URL: "https://api.tudominio.com",   // ← cambia esto
```

Todas las rutas están documentadas en el mismo archivo con método HTTP y payload esperado.

### 2 — Usar apiFetch() en cualquier componente

```js
import { apiFetch } from "../../api/client";
import { API } from "../../api/config";

// GET lista de pacientes
const pacientes = await apiFetch(API.ENFERMERO.PACIENTES);

// POST login
const res = await apiFetch(API.AUTH.LOGIN, {
  method: "POST",
  body: JSON.stringify({ empleadoId, password, role }),
});

// GET con ruta dinámica
const reporte = await apiFetch(
  API.SUPERVISOR.REPORTE_DETAIL.replace(":id", reporteId)
);

// Descarga blob
const blob = await apiFetch(API.RH.EXPORT_XLS, { blob: true });
const url  = URL.createObjectURL(blob);
```

### 3 — Reemplazar mock data

Cada página importa sus datos desde `src/constants/mockData.js`.
Cuando tengas el backend listo, sustituye esas importaciones por llamadas a `apiFetch()`.

---

## Flujo de navegación

```
HeroPage  →  ProfilePage  →  LoginPage
                              ├── enfermero  →  EnfermeroApp
                              │               (Dashboard / Registros / EntregaTurno)
                              ├── supervisor →  SupervisorApp
                              │               (Dashboard / ValidarGuardia / Registros / EntregaTurno)
                              └── rh         →  RhApp
                                              (Personal / Auditoría / Dashboard / Registros / EntregaTurno)
```

---

## Tecnologías

| Capa        | Tecnología          |
|-------------|---------------------|
| UI          | React 18            |
| Build       | Vite 5              |
| Estilos     | CSS-in-JS (variables CSS nativas) |
| HTTP        | Fetch API (nativa)  |
| Exports     | openpyxl + reportlab (Python) |

---

© 2026 HospTrack Systems
