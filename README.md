# 🩺 SaludTech — Hospital Management System

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Atomic Design](https://img.shields.io/badge/Atomic_Design-Architecture-FF4081?style=for-the-badge)

Plataforma frontend (SPA) diseñada para brindar a enfermeros, supervisores y recursos humanos una herramienta de gestión inteligente y fluida para cambios de turno, tareas y control de pacientes.

---

## 🚀 Características

- 📦 **Interfaces especializadas** para múltiples roles de usuario operativos (Enfermero, Supervisor, RH).
- 🔄 **Diseño Atómico (Atomic Design)** para garantizar la reutilización extrema de componentes.
- 📋 **Exportación Documental** de bitácoras e incidentes en formato XPS/PDF/Excel.
- 🖼️ **Experiencia Responsiva** adaptada al entorno dinámico de un hospital.
- 🔐 **Comunicación Segura** orientada a consumir una API REST centralizada y autenticada.
- 🔌 **Generación base64 nativa** empleando scripts de automatización híbridos (Node + Python).

---

## 🖥️ Arquitectura UI: Diseño Atómico

El proyecto sigue metodologías estrictas de `Atomic Design` para mantener el código DRY, modular y fácil de escalar a medida que crece el sistema de pantallas del hospital.

```text
Componentes
     │
     ├── Atoms      (Botones, Badges, Inputs, Iconos)
     ├── Molecules  (Tarjetas de paciente, Items de tarea, Modales)
     ├── Organisms  (Sidebars, Topbars, Banners)
     ├── Templates  (Layouts base con slots para contenido)
     └── Pages      (Las vistas enrutadas completas)
```

### Stack

| Tecnología | Uso |
|---|---|
| **React 18** | Biblioteca para construir la UI declarativa |
| **Vite 5** | Entorno de desarrollo ultrarrápido y bundler |
| **CSS Modules / Vanilla** | Estilos estandarizados nativos y variables CSS |
| **Fetch API** | Consumo nativo de la API REST del backend |
| **Python** | Usado en *build-time* para generar artefactos descargables |

---

## 📁 Estructura del Proyecto

```text
saludtech/
├── build/
│   ├── generateExports.js   # Script Node (generador base64 de reportes)
│   └── generateFiles.py     # Script Python para manipular xlsx y pdf
├── src/
│   ├── api/
│   │   ├── config.js        # Configuraciones y endpoints (API_URL)
│   │   └── client.js        # Helper custom fetchAuth()
│   ├── components/
│   │   ├── atoms/           # Unidades mínimas de UI
│   │   ├── molecules/       # Combinaciones de átomos
│   │   ├── organisms/       # Secciones completas UI
│   │   ├── templates/       # Layouts estructurales
│   │   └── pages/           # Vistas categorizadas por rol (rh, enfermero, public)
│   ├── constants/
│   ├── hooks/               # Custom hooks (ej. useTimer)
│   ├── styles/              # Reglas globales y variables visuales
│   ├── App.jsx              # Router de nivel superior
│   └── main.jsx             # Punto de montaje de React
└── vite.config.js           # Configuración del dev server
```

---

## ⚙️ Instalación y Desarrollo

### Requisitos
- Node.js ≥ 18
- Python (Solo si se requiere regenerar exportables locales)

### 1. Variables y Conexión al Backend

Asegúrate de que el frontend está apuntando a tu API en `src/api/config.js`. Por defecto apunta al entorno de desarrollo del backend (`localhost:3000`).

```javascript
// src/api/config.js
export const API = {
  BASE_URL: "http://localhost:3000",
  // ...
```

### 2. Instalación

Si previamente había un `node_modules`, se recomienda limpiar:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. Iniciar entorno Dev

```bash
npm run dev
```

El servidor Vite levantará en **`http://localhost:5173`**.

---

## 📊 Automatización de Archivos Exportables (RH)

Para el rol de Recursos Humanos, el sistema suministra reportes en base64 precompilados. Para regenerarlos si cambian los manuales base:

```bash
# Requiere python
pip install openpyxl reportlab
npm run generate-exports
```
Esto procesa los esquemas de archivos desde `build/` y vuelca la carga codificada en `src/constants/exportFiles.js`.

---

## 🗺️ Flujo de Navegación del Sistema

```text
HeroPage  →  ProfilePage  →  LoginPage
                               ├── 👩‍⚕️ enfermero  →  Dashboard / Registros / EntregaTurno
                               ├── 👨‍💼 supervisor →  Dashboard / ValidarGuardia / Registros
                               └── 🏢 rh         →  Dashboard / Personal / Auditoría
```

Cada ruta inyecta un `Layout` global que orquesta la barra lateral (`Sidebar`) y la barra superior (`Topbar`) con persistencia dinámica.

---


