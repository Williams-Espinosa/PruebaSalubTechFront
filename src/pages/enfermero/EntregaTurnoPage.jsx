import { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import { IcSwap, IcCheckCircle, IcCheck } from "../../components/atoms/Icons";
import { createEntregaTurno, fetchUsuarios } from "../../api/supabaseService";

const CHECKLIST = [
  "Medicamentos del turno administrados",
  "Signos vitales de todos los pacientes actualizados",
  "Pendientes clínicos notificados al supervisor",
  "Bitácoras de eventos cerradas",
];

export default function EntregaTurnoPage({ onLogout }) {
  const [checked,    setChecked]    = useState(Array(CHECKLIST.length).fill(false));
  const [obs,        setObs]        = useState("");
  const [receptor,   setReceptor]   = useState("");
  const [usuarios,   setUsuarios]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsuarios();
        setUsuarios((data || []).filter(u => u.rol === "Enfermero" && u.activo));
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    load();
  }, []);

  const toggle  = i => setChecked(p => { const n=[...p]; n[i]=!n[i]; return n; });
  const allDone = checked.every(Boolean);

  const getTurnoActual = () => {
    const h = new Date().getHours();
    if (h >= 7 && h < 14) return "Matutino";
    if (h >= 14 && h < 21) return "Vespertino";
    return "Nocturno";
  };

  const handleFinalizar = async () => {
    if (!receptor) { alert("Selecciona un enfermero receptor"); return; }
    setLoading(true);
    try {
      await createEntregaTurno({
        id_usuario: parseInt(receptor),
        tipo_turno: getTurnoActual(),
        observaciones: obs,
      });
      alert("Turno entregado exitosamente");
      onLogout();
    } catch (e) {
      console.warn("Error finalizando turno:", e.message);
      alert("Error al registrar entrega: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none" };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Confirmar Entrega de Turno</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Traspaso de responsabilidad profesional — Turno {getTurnoActual()}</div>
        </div>
        <div style={{ width:48, height:48, borderRadius:14, background:"var(--orange)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(245,129,61,.35)" }}>
          <IcSwap/>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:"28px 32px", boxShadow:"var(--shadow-sm)", marginBottom:24 }}>
        <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:700, display:"flex", alignItems:"center", gap:8, marginBottom:20, color:"var(--blue)" }}>
          <IcCheckCircle s={18}/> Checklist de Tareas Finalizadas
        </div>
        {CHECKLIST.map((item, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom: i < CHECKLIST.length-1 ? "1px solid var(--border)" : "none", cursor:"pointer" }}>
            <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${checked[i]?"var(--blue)":"var(--border)"}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:checked[i]?"var(--blue)":"transparent", transition:"all .2s" }}>
              {checked[i] && <IcCheck/>}
            </div>
            <span style={{ fontSize:14, fontWeight:500, color:checked[i]?"var(--text-soft)":"var(--text-dark)", textDecoration:checked[i]?"line-through":"none" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Observaciones + Receptor */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:16 }}>Observaciones Generales</div>
          <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Añada notas para el siguiente turno..." style={{ ...inputStyle, resize:"none", height:110 }}/>
        </div>
        <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:16 }}>Enfermero(a) Receptor</div>
          {loadingUsers ? (
            <div style={{ color:"var(--text-soft)", fontSize:13 }}>Cargando enfermeros...</div>
          ) : (
            <select style={{ ...inputStyle, background:"#fff", marginBottom:16 }} value={receptor} onChange={e => setReceptor(e.target.value)}>
              <option value="">Seleccionar enfermero receptor...</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_completo}</option>
              ))}
            </select>
          )}
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:10 }}>Estado de Verificación</div>
          <div style={{ display:"flex", gap:10 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width:14, height:14, borderRadius:"50%", background: checked[i] ? "var(--blue)" : "var(--border)", transition:"background .2s" }}/>)}
          </div>
        </div>
      </div>

      <Button variant="dark" fullWidth disabled={!allDone || loading || !receptor} onClick={handleFinalizar}>
        <IcSwap/> {loading ? "Finalizando..." : "Finalizar y Entregar Turno"}
      </Button>
      <p style={{ fontSize:11.5, color:"var(--text-soft)", textAlign:"center", marginTop:10, lineHeight:1.6 }}>
        Al hacer clic en finalizar, usted confirma que toda la información es correcta y se cierra su acceso al sistema por este turno.
      </p>
    </div>
  );
}
