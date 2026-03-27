import { useState } from "react";
import Button from "../../components/atoms/Button";
import { IcDoc, IcShield, IcCheckCircle, IcCheck } from "../../components/atoms/Icons";
import { createNota } from "../../api/supabaseService";

const PRIORITY_COLOR = { alta:"var(--red)", media:"#D69E2E", baja:"var(--green)" };

export default function RegistrosPage({ patients = [], initialPatientId }) {
  const norm          = patients;
  const firstId       = initialPatientId ?? norm[0]?.id;

  const [selId,   setSelId]   = useState(firstId);
  const [urgency, setUrgency] = useState("bajo");
  const [tipo,    setTipo]    = useState("");
  const [desc,    setDesc]    = useState("");
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  const patient  = norm.find(p => p.id === selId) || norm[0] || {};
  const initials = (patient.name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  const showMsg = (type, text) => { setMsg({type,text}); setTimeout(()=>setMsg(null),4000); };

  const handleGuardar = async () => {
    if (desc.length < 10) return;
    setSaving(true);
    try {
      await createNota({
        id_paciente:  selId,
        tipo_nota:    tipo || "Nota de evolución",
        descripcion:  desc,
        urgencia:     urgency === "alto",
      });
      setTipo(""); setDesc(""); setUrgency("bajo");
      showMsg("ok", "Nota guardada exitosamente en la bitácora");
    } catch (e) {
      showMsg("err", e.message || "Error al guardar la nota");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Registrar Incidentes y Notas</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Documentación clínica obligatoria</div>
        </div>
        <button style={{ width:48, height:48, borderRadius:14, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", border:"none", boxShadow:"0 4px 16px rgba(61,91,245,.3)" }}>
          <IcDoc c="white" s={20}/>
        </button>
      </div>

      {/* Messages */}
      {msg && (
        <div style={{ borderRadius:"var(--radius-sm)", padding:"12px 16px", marginBottom:20, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, background: msg.type==="ok"?"var(--green-light)":"#FFF5F5", border:`1px solid ${msg.type==="ok"?"var(--green)":"var(--red)"}`, color: msg.type==="ok"?"var(--green)":"var(--red)" }}>
          {msg.type==="ok" ? <IcCheckCircle c="var(--green)" s={16}/> : "⚠️"} {msg.text}
        </div>
      )}

      <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:32, boxShadow:"var(--shadow-sm)" }}>
        {/* Patient selector */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:10 }}>Paciente</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {norm.length === 0 && <div style={{ color:"var(--text-soft)", fontSize:13 }}>No hay pacientes disponibles</div>}
            {norm.map(p => {
              const ini = (p.name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
              const sel = p.id === selId;
              const pc  = PRIORITY_COLOR[p.priority] || "var(--text-soft)";
              return (
                <button key={p.id} onClick={() => setSelId(p.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:"var(--radius-sm)", border:`2px solid ${sel?"var(--blue)":"var(--border)"}`, background:sel?"var(--blue-light)":"#fff", cursor:"pointer", transition:"all .18s", flex:1, minWidth:160, textAlign:"left" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0, background:sel?"var(--blue)":"var(--gray-bg)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'TuFuente',sans-serif", fontSize:12, fontWeight:700, color:sel?"#fff":"var(--text-mid)" }}>{ini}</div>
                  <div>
                    <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:13, fontWeight:700, color:sel?"var(--blue)":"var(--text-dark)" }}>{p.name}</div>
                    <div style={{ fontSize:11, color:"var(--text-soft)", marginTop:1 }}>{p.bed || p.room}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:pc, flexShrink:0 }}/>
                      <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, color:pc }}>{p.priority}</span>
                    </div>
                  </div>
                  {sel && <div style={{ marginLeft:"auto" }}><IcCheck c="var(--blue)" s={14}/></div>}
                </button>
              );
            })}
          </div>
          {patient.name && (
            <div style={{ marginTop:12, background:"var(--gray-bg)", borderRadius:"var(--radius-sm)", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>{initials}</div>
              <div>
                <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700 }}>{patient.name}</div>
                <div style={{ fontSize:12, color:"var(--text-mid)", marginTop:2 }}>{patient.bed || patient.room} • {patient.dx}</div>
              </div>
              <div style={{ marginLeft:"auto", fontSize:11, color:"var(--text-soft)" }}>Paciente seleccionado</div>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Tipo de Evento</label>
            <input value={tipo} onChange={e=>setTipo(e.target.value)} placeholder="Ej. Nota de evolución, Incidencia…" style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none" }}/>
          </div>
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Nivel de Urgencia</label>
            <div style={{ display:"flex", gap:10 }}>
              {[["bajo","var(--green-light)","var(--green)","var(--green)"],["medio","#FFFAF0","#D69E2E","#D69E2E"],["alto","#FFF5F5","var(--red)","var(--red)"]].map(([u,bg,border,color]) => (
                <button key={u} onClick={()=>setUrgency(u)} style={{ flex:1, padding:10, borderRadius:"var(--radius-sm)", border:`1.5px solid ${urgency===u?border:"var(--border)"}`, background:urgency===u?bg:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:urgency===u?color:"var(--text-mid)", fontFamily:"'DM Sans',sans-serif" }}>
                  {u[0].toUpperCase()+u.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Descripción del Evento</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describa detalladamente lo ocurrido o la evolución del paciente..." style={{ width:"100%", border:`1.5px solid ${desc.length>0&&desc.length<10?"var(--red)":"var(--border)"}`, borderRadius:"var(--radius-sm)", padding:"12px 14px", fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none", resize:"vertical", minHeight:130 }}/>
          <p style={{ fontSize:11.5, color:desc.length>0&&desc.length<10?"var(--red)":"var(--text-soft)", marginTop:6 }}>
            Mínimo 10 caracteres ({desc.length} escritos).
          </p>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <Button fullWidth onClick={handleGuardar} disabled={saving||desc.length<10}>
            <IcCheckCircle c="white" s={18}/> {saving?"Guardando...":"Guardar en Bitácora"}
          </Button>
          <Button variant="secondary" onClick={()=>{setTipo("");setDesc("");}}>Cancelar</Button>
        </div>
      </div>

      <div style={{ background:"var(--blue-light)", borderRadius:"var(--radius-sm)", padding:"20px 24px", display:"flex", alignItems:"flex-start", gap:14, marginTop:24 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><IcShield c="white" s={18}/></div>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:13, fontWeight:700, color:"var(--blue)", marginBottom:4 }}>Responsabilidad Legal</div>
          <div style={{ fontSize:12.5, color:"var(--blue)", lineHeight:1.6 }}>Todas las notas firmadas digitalmente tienen validez legal. Asegúrese de que la información sea verídica y oportuna.</div>
        </div>
      </div>
    </div>
  );
}
