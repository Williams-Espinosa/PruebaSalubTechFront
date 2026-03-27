import { useState } from "react";
import Button from "../../components/atoms/Button";
import { IcClock, IcCheckCircle, IcArrow } from "../../components/atoms/Icons";
import { createEntregaTurno } from "../../api/supabaseService";

const CHECKLIST = ["Equipo médico inventariado","Insumos repuestos","Bitácora de enfermería firmada","Limpieza de área solicitada"];

export default function SupEntregaTurno({ onLogout, user }) {
  const [resumen,    setResumen]    = useState("");
  const [notas,      setNotas]      = useState("");
  const [pendientes, setPendientes] = useState("");
  const [saving,     setSaving]     = useState(false);

  const fieldStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none", marginBottom:20 };
  const textareaStyle = { ...fieldStyle, resize:"none", minHeight:120 };

  const getTurnoActual = () => {
    const h = new Date().getHours();
    if (h >= 7 && h < 14) return "Matutino";
    if (h >= 14 && h < 21) return "Vespertino";
    return "Nocturno";
  };

  const handleFinalizar = async () => {
    if (!resumen && !notas) {
      alert("Por favor, ingrese un resumen o notas del turno.");
      return;
    }
    setSaving(true);
    try {
      // Concatenar campos para la columna 'observaciones' de la tabla turnos
      const obsFinal = `RESUMEN: ${resumen}\nNOTAS: ${notas}\nPENDIENTES: ${pendientes}`;
      
      await createEntregaTurno({
        id_usuario: user?.id_usuario || 1, // Fallback si no hay user logueado (aunque debería haber)
        tipo_turno: getTurnoActual(),
        observaciones: obsFinal,
      });
      
      alert("Reporte de supervisor enviado exitosamente.");
      onLogout();
    } catch (err) {
      console.error("Error al entregar turno supervisor:", err);
      alert("Error al enviar reporte: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Entrega de Turno</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Documentación obligatoria para el cierre de guardia como {user?.rol || "Médico / Supervisor"}.</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--blue-light)", borderRadius:"var(--radius-sm)", padding:"10px 16px", fontSize:13, fontWeight:600, color:"var(--blue)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
             <IcClock c="var(--blue)" s={15}/> 
             <span>Turno Actual: {getTurnoActual()}</span>
          </div>
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
          
          <Button fullWidth onClick={handleFinalizar} disabled={saving}>
            {saving ? "Enviando..." : <><IcArrow c="white" s={18}/> Enviar Reporte y Cerrar Turno</>}
          </Button>
        </div>

        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)", height:"fit-content" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", gap:8, marginBottom:16, color:"var(--blue)" }}>
            <IcCheckCircle s={16}/> Checklist de Cierre
          </div>
          <p style={{ fontSize:12, color:"var(--text-soft)", marginBottom:12 }}>Asegúrese de cumplir con los protocolos antes de finalizar.</p>
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
