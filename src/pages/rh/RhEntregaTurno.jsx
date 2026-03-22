// pages/rh/RhEntregaTurno.jsx
import { useState } from "react";
import Button from "../../components/atoms/Button";
import Modal  from "../../components/molecules/Modal";
import { IcClock, IcShield, IcPlus, IcArrow, IcCheck } from "../../components/atoms/Icons";
import { PENDIENTES_TURNO, NE_CHECKLIST } from "../../constants/mockData";

const SEV_COLORS = {
  grave:    { bg:"#FFF5F5", color:"var(--red)"    },
  moderado: { bg:"#FFFAF0", color:"#D69E2E"       },
  leve:     { bg:"var(--blue-light)", color:"var(--blue)" },
};

export default function RhEntregaTurno() {
  const [showModal,  setShowModal]  = useState(false);
  const [checkedNE,  setCheckedNE]  = useState(Array(NE_CHECKLIST.length).fill(false));
  const [responsible,setResponsible]= useState("");
  const [obs,        setObs]        = useState("");

  const toggleNE = i => setCheckedNE(p => { const n=[...p]; n[i]=!n[i]; return n; });

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

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Turno info */}
        <div>
          <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, color:"var(--blue)", marginBottom:20 }}>
              <IcClock c="var(--blue)" s={15}/> Turno Actual: Matutino
            </div>
            {[["RESPONSABLE","Dra. Elena Martínez"],["PRÓXIMO TURNO","Vespertino (14:00 hrs)"],["ESTADO DE SALA","Normal - Sin pendientes graves"]].map(([label,val])=>(
              <div key={label} style={{ background:"var(--gray-bg)", borderRadius:"var(--radius-sm)", padding:"12px 14px", marginBottom:12 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:4 }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:600, color: label==="ESTADO DE SALA"?"var(--green)":undefined }}>{val}</div>
              </div>
            ))}
          </div>
          {/* Security reminder */}
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

        {/* Pendientes */}
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>Pendientes para el Siguiente Turno</div>
          {PENDIENTES_TURNO.map((p,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom: i<PENDIENTES_TURNO.length-1?"1px solid var(--border)":"none" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:p.done?"var(--green-light)":"var(--gray-bg)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'TuFuente',sans-serif", fontSize:13, fontWeight:700, flexShrink:0, color:p.done?"var(--green)":undefined }}>
                {p.done ? <IcCheck c="var(--green)" s={12}/> : p.num}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:2 }}>{p.name}</div>
                <div style={{ fontSize:12, color:"var(--text-soft)" }}>{p.sub}</div>
              </div>
              <span style={{ padding:"3px 9px", borderRadius:6, fontSize:10, fontWeight:700, textTransform:"uppercase", ...SEV_COLORS[p.sev] }}>{p.sev.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nueva Entrega Modal */}
      {showModal && (
        <Modal title="Nueva Entrega de Turno" subtitle="Completa los datos para la transición de mando." onClose={() => setShowModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Turno Saliente</label>
              <input defaultValue="Matutino (07:00 - 14:00)" readOnly style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"10px 13px", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"var(--gray-bg)", color:"var(--text-mid)" }}/>
            </div>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Responsable Entrante</label>
              <input value={responsible} onChange={e=>setResponsible(e.target.value)} placeholder="Nombre del responsable" style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"10px 13px", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", outline:"none" }}/>
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.1, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Observaciones Generales</label>
            <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Describe el estado general de la sala y pendientes críticos..." style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"10px 13px", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", outline:"none", resize:"none", height:80 }}/>
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
            <Button style={{ flex:2 }} onClick={() => setShowModal(false)}><IcArrow c="white" s={16}/> Confirmar Entrega</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
