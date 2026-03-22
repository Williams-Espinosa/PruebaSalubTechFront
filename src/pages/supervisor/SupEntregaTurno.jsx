// pages/supervisor/SupEntregaTurno.jsx
import { useState } from "react";
import Button from "../../components/atoms/Button";
import { IcClock, IcCheckCircle, IcArrow } from "../../components/atoms/Icons";

const CHECKLIST = ["Equipo médico inventariado","Insumos repuestos","Bitácora de enfermería firmada","Limpieza de área solicitada"];

export default function SupEntregaTurno({ onLogout }) {
  const [resumen,    setResumen]    = useState("");
  const [notas,      setNotas]      = useState("");
  const [pendientes, setPendientes] = useState("");

  const fieldStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none", marginBottom:20 };
  const textareaStyle = { ...fieldStyle, resize:"none", minHeight:120 };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Entrega de Turno</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Documentación obligatoria para el cierre de guardia.</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--blue-light)", borderRadius:"var(--radius-sm)", padding:"10px 16px", fontSize:13, fontWeight:600, color:"var(--blue)" }}>
          <IcClock c="var(--blue)" s={15}/> Fin de Turno: 14:00 - 22:00
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:24 }}>
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:28, boxShadow:"var(--shadow-sm)" }}>
          <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Resumen General</label>
          <input style={fieldStyle} placeholder="Resumen del estado general del hospital..." value={resumen} onChange={e=>setResumen(e.target.value)}/>
          <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Notas del Turno</label>
          <textarea style={textareaStyle} placeholder="Describa los eventos más relevantes ocurridos durante su guardia..." value={notas} onChange={e=>setNotas(e.target.value)}/>
          <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Pendientes para el Siguiente Turno</label>
          <textarea style={textareaStyle} placeholder="Medicaciones pendientes, estudios programados, etc..." value={pendientes} onChange={e=>setPendientes(e.target.value)}/>
          <Button fullWidth onClick={onLogout}><IcArrow c="white" s={18}/> Enviar Reporte y Cerrar Turno</Button>
        </div>

        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)", height:"fit-content" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", gap:8, marginBottom:16, color:"var(--blue)" }}>
            <IcCheckCircle s={16}/> Checklist de Cierre
          </div>
          {CHECKLIST.map((item,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom: i<CHECKLIST.length-1?"1px solid var(--border)":"none", fontSize:13 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--green)", flexShrink:0 }}/>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
