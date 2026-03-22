export const PATIENTS = [
  { id:1, name:"Carlos Rodríguez",  dx:"Post-op Apendicitis",  bed:"Cama A-102", priority:"media", age:45, sex:"M" },
  { id:2, name:"María Elena Garza", dx:"Insuficiencia Renal",  bed:"Cama B-204", priority:"alta",  age:68, sex:"F" },
  { id:3, name:"Jorge Alberto Luis", dx:"Observación General", bed:"Cama C-301", priority:"baja",  age:32, sex:"M" },
];

export const TASKS_INIT = [
  { id:1, cat:"MEDICACIÓN", time:"14:30", name:"Ceftriaxona 1g IV",          patient:"Carlos Rodríguez • Cama A-102",  done:false },
  { id:2, cat:"SIGNOS",     time:"15:00", name:"Control de signos vitales",   patient:"María Elena Garza • Cama A-102", done:false },
  { id:3, cat:"CURACIÓN",   time:"16:00", name:"Curación de herida quirúrgica",patient:"María Elena Garza • Cama A-102",done:false },
];

export const SUP_STAFF = [
  { name:"Dra. Elena Martínez", role:"Médico Residente" },
  { name:"Enf. Ricardo Soto",   role:"Enfermería UCI"   },
  { name:"Dr. Julián Amador",   role:"Cardiólogo"       },
];

export const VG_REPORTS = [
  { id:"REP-001", name:"Marta Solís", floor:"Piso 3 - Pediatría", time:"14:05", incidents:2 },
  { id:"REP-002", name:"Juan Pérez",  floor:"UCI - Coronaria",    time:"14:12", incidents:5 },
  { id:"REP-003", name:"Carla Ruiz",  floor:"Piso 1 - Cirugía",   time:"14:20", incidents:0 },
];

export const SUP_PATIENTS = [
  { name:"Ana Martínez",    age:64, bed:"302-A", dx:"Post-operatorio cadera", status:"estable", statusLabel:"Estable",     priority:"Media", last:"hace 45 min"  },
  { name:"Roberto Gómez",   age:45, bed:"215-B", dx:"Insuficiencia Renal",    status:"critico", statusLabel:"Crítico",     priority:"Alta",  last:"hace 10 min"  },
  { name:"Lucía Fernández", age:28, bed:"108",   dx:"Cuadro febril",          status:"obs",     statusLabel:"Observación", priority:"Baja",  last:"hace 2 horas" },
  { name:"Carlos Ruiz",     age:72, bed:"412-C", dx:"Hipertensión severa",    status:"estable", statusLabel:"Estable",     priority:"Media", last:"hace 1 hora"  },
  { name:"Elena Soria",     age:53, bed:"305-B", dx:"Recuperación Neumonía",  status:"estable", statusLabel:"Estable",     priority:"Baja",  last:"hace 30 min"  },
];

export const RH_STAFF = [
  { name:"Dra. Elena Martínez", id:"MARE904001HOFLRS01", role:"supervisor", spec:"Cardiología",      turno:"Matutino",   activo:true  },
  { name:"Lic. Ricardo Gómez",  id:"GORR921215HOFLRS02", role:"enfermero",  spec:"Urgencias",         turno:"Nocturno",   activo:true  },
  { name:"Dr. Julián Sossa",    id:"SOJJ800120HOFLRS03", role:"medico",     spec:"Pediatría",          turno:"Vespertino", activo:false },
  { name:"Mtra. Sofía Ruiz",    id:"RUIS880808MOFLRS04", role:"enfermero",  spec:"Terapia Intensiva",  turno:"Matutino",   activo:true  },
];

export const INCIDENTS = [
  { patient:"Juan Pérez",        pid:"I1", desc:"Reacción alérgica leve a medicamento administrado.",              reporter:"Lic. Ricardo Gómez",  rInitial:"L", date:"2026-01-25", time:"14:30 hrs", sev:"leve"     },
  { patient:"María García",      pid:"I2", desc:"Caída accidental al intentar levantarse sin asistencia.",         reporter:"Mtra. Sofía Ruiz",    rInitial:"M", date:"2026-01-26", time:"09:15 hrs", sev:"moderado" },
  { patient:"Roberto Hernández", pid:"I3", desc:"Error en la actualización de signos vitales en el sistema.",      reporter:"Lic. Ricardo Gómez",  rInitial:"L", date:"2026-01-27", time:"22:10 hrs", sev:"leve"     },
];

export const AUD_PATIENTS = [
  { name:"Juan Pérez",        id:"p1", bed:"B-102", events:1 },
  { name:"María García",      id:"p2", bed:"B-205", events:1 },
  { name:"Roberto Hernández", id:"p3", bed:"C-301", events:1 },
  { name:"Ana López",         id:"p4", bed:"A-101", events:0 },
];

export const BIT_LOGS = [
  { event:"Login Exitoso",  user:"Admin HR (Elena)", ts:"29/01/26 08:30:12", status:"success" },
  { event:"Edición Perfil", user:"Admin HR (Elena)", ts:"29/01/26 09:15:44", status:"success" },
  { event:"Intento Fallido",user:"HT-SERVICE-GATE",  ts:"29/01/26 09:22:10", status:"blocked" },
  { event:"Baja Empleado",  user:"System-Auto",       ts:"29/01/26 10:05:00", status:"success" },
  { event:"Exportar PDF",   user:"Admin HR (Elena)", ts:"29/01/26 10:30:22", status:"success" },
  { event:"Actualizar DB",  user:"SysAdmin",           ts:"29/01/26 11:00:00", status:"success" },
];

export const RH_ALERTS = [
  { name:"Nueva Alta Registrada",    source:"Dra. Martínez", time:"Hace 5 min"   },
  { name:"Incidente Leve - Piso 2",  source:"Enf. Gómez",    time:"Hace 12 min"  },
  { name:"Cambio de Turno: Matutino",source:"Sistema",        time:"Hace 1 hora"  },
  { name:"Personal dado de baja",    source:"Admin RRHH",     time:"Hace 3 horas" },
];

export const PENDIENTES_TURNO = [
  { num:1, name:"Juan Pérez (B-102)",    sub:"Suministrar antibiótico 15:00 hrs",        sev:"grave",    done:false },
  { num:2, name:"María García (B-205)",  sub:"Revisión de signos cada 2 horas",          sev:"moderado", done:false },
  { num:3, name:"Inventario Farmacia",   sub:"Validar llegada de lote de insulina",       sev:"leve",     done:true  },
  { num:4, name:"Limpieza Quirófano A",  sub:"Esterilización completa post-operación",    sev:"grave",    done:false },
];

export const NE_CHECKLIST = [
  "Inventario de narcóticos completo",
  "Bitácora de signos actualizada",
  "Limpieza de estaciones validada",
  "Medicamentos de 15:00 listos",
  "Equipos médicos funcionales",
  "Entrega de llaves realizada",
];
