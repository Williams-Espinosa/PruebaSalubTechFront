// pages/supervisor/ValidarGuardia.jsx
import { useState } from "react";
import Button from "../../components/atoms/Button";
import { IcSearch, IcClock, IcDoc, IcCheckCircle, IcCheck } from "../../components/atoms/Icons";
import { VG_REPORTS } from "../../constants/mockData";

export default function ValidarGuardia() {
  const [selected, setSelected] = useState(null);
  const [firma,    setFirma]    = useState("");
  const rep = selected != null ? VG_REPORTS[selected] : null;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", minHeight:"calc(100vh - 64px)" }}>
      {/* Left */}
      <div style={{ borderRight:"1px solid var(--border)", background:"#fff", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:20 }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:18, fontWeight:800, marginBottom:4 }}>Validar Cierre de Guardia</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginBottom:16 }}>Revisión y firma legal de reportes de entrega de turno.</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--gray-bg)", borderRadius:"var(--radius-sm)", padding:"8px 14px" }}>
            <IcSearch/><input placeholder="Buscar reporte o enfermero..." style={{ border:"none", outline:"none", background:"transparent", fontSize:13, fontFamily:"'DM Sans',sans-serif", flex:1 }}/>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"0 12px 12px" }}>
          {VG_REPORTS.map((r,i) => (
            <div key={r.id} onClick={()=>setSelected(i)} style={{ borderRadius:"var(--radius-sm)", padding:16, marginBottom:8, cursor:"pointer", border:`1.5px solid ${selected===i?"var(--blue)":"transparent"}`, background:selected===i?"var(--blue-light)":"transparent", transition:"all .15s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:.8, color:"var(--blue)" }}>{r.id}</span>
                <span style={{ fontSize:11, color:"var(--text-soft)", display:"flex", alignItems:"center", gap:4 }}><IcClock c="var(--text-soft)" s={11}/> {r.time}</span>
              </div>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:4 }}>{r.name}</div>
              <div style={{ fontSize:12, color:"var(--text-mid)", marginBottom:6 }}>{r.floor}</div>
              {r.incidents > 0 && <div style={{ fontSize:11.5, fontWeight:600, color:"var(--red)" }}>{r.incidents} incidentes registrados</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Right */}
      <div style={{ padding:28 }}>
        {!rep ? (
          <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, color:"var(--text-soft)", textAlign:"center", padding:40 }}>
            <div style={{ width:72, height:72, borderRadius:20, background:"var(--blue-light)", display:"flex", alignItems:"center", justifyContent:"center" }}><IcDoc c="var(--blue)" s={30}/></div>
            <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:18, fontWeight:700, color:"var(--text-dark)" }}>No hay reporte seleccionado</div>
            <p style={{ fontSize:13, lineHeight:1.7 }}>Seleccione un reporte del listado de la izquierda para revisar la bitácora y proceder con la validación de guardia.</p>
          </div>
        ) : (
          <div style={{ animation:"fadeUp .3s ease both" }}>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:20, fontWeight:800, marginBottom:4 }}>Reporte {rep.id} — {rep.name}</div>
              <div style={{ fontSize:13, color:"var(--text-mid)" }}>{rep.floor} · Enviado a las {rep.time}</div>
            </div>
            {rep.incidents > 0 && (
              <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:20, boxShadow:"var(--shadow-sm)", marginBottom:20 }}>
                <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}><IcCheckCircle c="var(--red)" s={16}/> Incidentes ({rep.incidents})</div>
                {Array.from({length:rep.incidents},(_,i)=>(
                  <div key={i} style={{ padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:3 }}>Incidente #{i+1}</div>
                    <div style={{ fontSize:13 }}>Nota clínica registrada durante el turno de guardia.</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)" }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:14 }}>Firma y Validación del Supervisor</div>
              <input value={firma} onChange={e=>setFirma(e.target.value)} placeholder="Nombre completo del supervisor" style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:12 }}/>
              <Button fullWidth disabled={!firma}><IcCheck c="white" s={16}/> Validar y Firmar Reporte</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
