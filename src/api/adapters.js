export function adaptPaciente(p) {
  return {
    id:       p.id_paciente,
    name:     p.nombre_completo,
    dx:       p.diagnostico_ingreso  ?? "",
    bed:      p.numero_habitacion    ?? p.id_habitacion ?? "",   
    priority: adaptPriority(p.estado_actual),                
    age:      calcAge(p.fecha_nacimiento),
    sex:      p.sexo ?? "",
    raw:      p,                                                  
  };
}

function adaptPriority(estado) {
  if (!estado) return "baja";
  const e = estado.toLowerCase();
  if (e.includes("crít") || e.includes("urgente")) return "alta";
  if (e.includes("observ") || e.includes("inestable"))  return "media";
  return "baja";
}

function calcAge(fechaNac) {
  if (!fechaNac) return "";
  const diff = Date.now() - new Date(fechaNac).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function adaptTarea(t) {
  return {
    id:      t.id_tarea,
    cat:     adaptCategoria(t.prioridad),
    time:    t.fecha_limite ? new Date(t.fecha_limite).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}) : "",
    name:    t.descripcion_tarea,
    patient: `${t.paciente ?? ""} • ${t.numero_habitacion ? "Hab "+t.numero_habitacion : ""}`.trim().replace(/• $/, ""),
    done:    t.estado === "Completada",
    raw:     t,
  };
}

function adaptCategoria(prioridad) {
  const map = { Urgente:"URGENTE", Alta:"ALTA", Media:"MEDICACIÓN", Baja:"SIGNOS" };
  return map[prioridad] ?? "TAREA";
}

export function adaptNota(n) {
  return {
    id:        n.id_nota,
    patient:   n.paciente   ?? "",
    pid:       `I${n.id_nota}`,
    desc:      n.descripcion ?? "",
    reporter:  n.enfermero  ?? "",
    rInitial:  (n.enfermero ?? "?")[0].toUpperCase(),
    date:      n.fecha_hora ? new Date(n.fecha_hora).toLocaleDateString("es-MX") : "",
    time:      n.fecha_hora ? new Date(n.fecha_hora).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})+" hrs" : "",
    sev:       n.urgencia ? "moderado" : "leve",
    raw:       n,
  };
}

export function adaptUsuario(u) {
  const rolMap = { Enfermero:"enfermero", Supervisor:"supervisor", RH:"rh" };
  return {
    id:     u.id_usuario,
    name:   u.nombre_completo,
    id_str: u.curp ?? `USR${u.id_usuario}`,
    role:   rolMap[u.rol] ?? "enfermero",
    rolLabel: u.rol,
    spec:   u.turno_asignado ?? "",
    turno:  u.turno_asignado ?? "No asignado",
    activo: u.activo,
    raw:    u,
  };
}
