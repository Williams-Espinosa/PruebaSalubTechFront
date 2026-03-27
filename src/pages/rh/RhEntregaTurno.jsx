import { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import Modal  from "../../components/molecules/Modal";
import { IcClock, IcShield, IcPlus, IcArrow, IcCheck } from "../../components/atoms/Icons";
import { fetchTareas, createEntregaTurno, fetchUsuarios } from "../../api/supabaseService";

const SEV_COLORS = {
  Urgente:  { bg:"#FFF5F5", color:"var(--red)"    },
  Alta:     { bg:"#FFF5F5", color:"var(--red)"    },
  Media:    { bg:"#FFFAF0", color:"#D69E2E"       },
  Baja:     { bg:"var(--blue-light)", color:"var(--blue)" },
};

const NE_CHECKLIST = [
  "Inventario de narcóticos completo",
  "Bitácora de signos actualizada",
  "Limpieza de estaciones validada",
  "Medicamentos de 15:00 listos",
  "Equipos médicos funcionales",
  "Entrega de llaves realizada",
];

export default function RhEntregaTurno() {
  const [tareas,       setTareas]       = useState([]);
  const [usuarios,     setUsuarios]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [checkedNE,    setCheckedNE]    = useState(Array(NE_CHECKLIST.length).fill(false));
  const [responsible,  setResponsible]  = useState("");
  const [turnoSaliente,setTurnoSaliente]= useState("Matutino");
  const [obs,          setObs]          = useState("");
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [tareasData, usuariosData] = await Promise.all([
          fetchTareas(),
          fetchUsuarios(),
        ]);
        // Mapear tareas pendientes
        const pendientes = (tareasData || [])
          .filter(t => t.estado !== "Completada")
          .map((t, i) => ({
            num: i + 1,
            name: t.pacientes?.nombre_completo
              ? `${t.pacientes.nombre_completo}`
              : t.descripcion_tarea || "Tarea pendiente",
            sub: t.descripcion_tarea || "",
            sev: t.prioridad || "Baja",
            done: t.estado === "Completada",
            raw: t,
          }));
        setTareas(pendientes);
        setUsuarios(usuariosData || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleNE = i => setCheckedNE(p => { const n=[...p]; n[i]=!n[i]; return n; });

  const handleEntrega = async () => {
    if (!responsible) { alert("Selecciona un responsable entrante"); return; }
    setSaving(true);
    try {
      await createEntregaTurno({
        id_usuario: parseInt(responsible),
        tipo_turno: turnoSaliente,
        observaciones: obs,
      });
      setShowModal(false);
      setObs("");
      setResponsible("");
      setCheckedNE(Array(NE_CHECKLIST.length).fill(false));
      alert("Entrega de turno registrada exitosamente");
    } catch (e) {
      alert("Error al registrar entrega: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const getTurnoActual = () => {
    const h = new Date().getHours();
    if (h >= 7 && h < 14) return "Matutino";
    if (h >= 14 && h < 21) return "Vespertino";
    return "Nocturno";
  };

  const getProximoTurno = () => {
    const t = getTurnoActual();
    if (t === "Matutino") return "Vespertino (14:00 hrs)";
    if (t === "Vespertino") return "Nocturno (21:00 hrs)";
    return "Matutino (07:00 hrs)";
  };

  const inputStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"10px 13px", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", outline:"none" };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Entrega de Turno</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Proceso de transición entre personal entrante y saliente.</div>
        </div>
        <Button onClick={() => setShowModal(true)}><IcPlus c="white" s={16}/> Nueva Entrega</Button>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>Cargando datos...</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {/* Info del turno */}
          <div>
            <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, color:"var(--blue)", marginBottom:20 }}>
                <IcClock c="var(--blue)" s={15}/> Turno Actual: {getTurnoActual()}
              </div>
              {[["RESPONSABLE", "Personal de turno activo"],["PRÓXIMO TURNO", getProximoTurno()],["ESTADO DE SALA", tareas.length > 0 ? `${tareas.length} pendiente${tareas.length > 1 ? "s" : ""}` : "Sin pendientes"]].map(([label,val])=>(
                <div key={label} style={{ background:"var(--gray-bg)", borderRadius:"var(--radius-sm)", padding:"12px 14px", marginBottom:12 }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:14, fontWeight:600, color: label==="ESTADO DE SALA" && tareas.length === 0 ? "var(--green)" : undefined }}>{val}</div>
                </div>
              ))}
            </div>
            {/* Recordatorio */}
            <div style={{ background:"var(--text-dark)", borderRadius:"var(--radius-sm)", padding:22 }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, color:"#fff", marginBottom:8 }}>Recordatorio de Seguridad</div>
              <div style={{ fontSize:12.5, color:"rgba(255,255,255,.65)", lineHeight:1.6, marginBottom:14 }}>
                Recuerda validar el conteo de insumos críticos y medicamentos controlados antes de firmar la entrega.
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--green)" }}>
                <IcShield c="var(--green)" s={14}/> PROTOCOLO HT-S2
              </div>
            </div>
          </div>

          {/* Pendientes desde Supabase */}
          <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)" }}>
            <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>Pendientes para el Siguiente Turno</div>
            {tareas.length === 0 && (
              <div style={{ padding:"32px 0", textAlign:"center", color:"var(--text-soft)", fontSize:13 }}>No hay tareas pendientes 🎉</div>
            )}
            {tareas.map((p,i) => {
              const sevStyle = SEV_COLORS[p.sev] || SEV_COLORS.Baja;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom: i<tareas.length-1?"1px solid var(--border)":"none" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:p.done?"var(--green-light)":"var(--gray-bg)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'TuFuente',sans-serif", fontSize:13, fontWeight:700, flexShrink:0, color:p.done?"var(--green)":undefined }}>
                    {p.done ? <IcCheck c="var(--green)" s={12}/> : p.num}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{p.name}</div>
                    <div style={{ fontSize:12, color:"var(--text-soft)" }}>{p.sub}</div>
                  </div>
                  <span style={{ padding:"3px 9px", borderRadius:6, fontSize:10, fontWeight:700, textTransform:"uppercase", background:sevStyle.bg, color:sevStyle.color }}>{p.sev}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Nueva Entrega */}
      {showModal && (
        <Modal title="Nueva Entrega de Turno" subtitle="Completa los datos para la transición de mando." onClose={() => setShowModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Turno Saliente</label>
              <select style={inputStyle} value={turnoSaliente} onChange={e => setTurnoSaliente(e.target.value)}>
                <option value="Matutino">Matutino (07:00 - 14:00)</option>
                <option value="Vespertino">Vespertino (14:00 - 21:00)</option>
                <option value="Nocturno">Nocturno (21:00 - 07:00)</option>
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Responsable Entrante</label>
              <select style={inputStyle} value={responsible} onChange={e => setResponsible(e.target.value)}>
                <option value="">Seleccionar...</option>
                {usuarios.map(u => (
                  <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_completo} ({u.rol})</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Observaciones Generales</label>
            <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Describe el estado general de la sala y pendientes críticos..." style={{ ...inputStyle, resize:"none", height:80 }}/>
          </div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:10 }}>Checklist de Seguridad</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
            {NE_CHECKLIST.map((item,i) => (
              <div key={i} onClick={() => toggleNE(i)} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", border:`1.5px solid ${checkedNE[i]?"var(--blue)":"var(--border)"}`, borderRadius:"var(--radius-sm)", cursor:"pointer", fontSize:13, background:checkedNE[i]?"var(--blue-light)":"#fff", transition:"all .15s" }}>
                <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${checkedNE[i]?"var(--blue)":"var(--border)"}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:checkedNE[i]?"var(--blue)":"transparent" }}>
                  {checkedNE[i] && <IcCheck s={10}/>}
                </div>
                {item}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button style={{ flex:1, padding:13, borderRadius:"var(--radius-sm)", background:"#fff", border:"1.5px solid var(--border)", fontSize:14, fontWeight:500, cursor:"pointer" }} onClick={() => setShowModal(false)}>Cancelar</button>
            <Button style={{ flex:2 }} onClick={handleEntrega} disabled={saving || !responsible}>
              {saving ? "Guardando..." : <><IcArrow c="white" s={16}/> Confirmar Entrega</>}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
