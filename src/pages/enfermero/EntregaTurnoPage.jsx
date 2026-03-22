// pages/enfermero/EntregaTurnoPage.jsx
import { useState } from "react";
import Button from "../../components/atoms/Button";
import { IcSwap, IcCheckCircle, IcCheck } from "../../components/atoms/Icons";
import { apiFetch } from "../../api/client";
import { API } from "../../api/config";

const CHECKLIST = [
  "Medicamentos del turno administrados",
  "Signos vitales de todos los pacientes actualizados",
  "Pendientes clínicos notificados al supervisor",
  "Bitácoras de eventos cerradas",
];

export default function EntregaTurnoPage({ onLogout }) {
  const [checked,  setChecked]  = useState(Array(CHECKLIST.length).fill(false));
  const [obs,      setObs]      = useState("");
  const [receptor, setReceptor] = useState("");
  const [loading,  setLoading]  = useState(false);

  const toggle  = i => setChecked(p => { const n=[...p]; n[i]=!n[i]; return n; });
  const allDone = checked.every(Boolean);

  const handleFinalizar = async () => {
    setLoading(true);
    try {
      // Finaliza el turno activo en el backend
      await apiFetch(API.TURNOS.INICIAR, { method: "POST" });
      onLogout();
    } catch (e) {
      console.warn("Error finalizando turno:", e.message);
      onLogout(); // Cierra de todas formas
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Confirmar Entrega de Turno</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Traspaso de responsabilidad profesional</div>
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

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
        <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:16 }}>Observaciones Generales</div>
          <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Añada notas para el siguiente turno..." style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"12px 14px", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none", resize:"none", height:110 }}/>
        </div>
        <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:16 }}>Enfermero(a) Receptor</div>
          <input value={receptor} onChange={e=>setReceptor(e.target.value)} placeholder="Nombre del enfermero receptor" style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none", background:"#fff", marginBottom:16 }}/>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:10 }}>Pin de Seguridad (Firma)</div>
          <div style={{ display:"flex", gap:10 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width:14, height:14, borderRadius:"50%", background:receptor.length>i?"var(--blue)":"var(--border)", transition:"background .2s" }}/>)}
          </div>
        </div>
      </div>

      <Button variant="dark" fullWidth disabled={!allDone || loading} onClick={handleFinalizar}>
        <IcSwap/> {loading ? "Finalizando..." : "Finalizar y Entregar Turno"}
      </Button>
      <p style={{ fontSize:11.5, color:"var(--text-soft)", textAlign:"center", marginTop:10, lineHeight:1.6 }}>
        Al hacer clic en finalizar, usted confirma que toda la información es correcta y se cierra su acceso al sistema por este turno.
      </p>
    </div>
  );
}
