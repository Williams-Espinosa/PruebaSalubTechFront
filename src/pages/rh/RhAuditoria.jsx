// pages/rh/RhAuditoria.jsx
import { useState, useEffect } from "react";
import Badge from "../../components/atoms/Badge";
import { IcDoc } from "../../components/atoms/Icons";
import { apiFetch } from "../../api/client";
import { API } from "../../api/config";
import { adaptNota, adaptPaciente } from "../../api/adapters";
import { INCIDENTS, AUD_PATIENTS } from "../../constants/mockData";

export default function RhAuditoria() {
  const [tab,       setTab]       = useState("incidentes");
  const [filter,    setFilter]    = useState("todas");
  const [incidents, setIncidents] = useState([]);
  const [patients,  setPatients]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [rawInc, rawPac] = await Promise.all([
          apiFetch(API.RH.AUDITORIA_INC),
          apiFetch(API.PACIENTES.LIST),
        ]);
        setIncidents(Array.isArray(rawInc) ? rawInc.map(adaptNota)     : INCIDENTS);
        setPatients( Array.isArray(rawPac) ? rawPac.map(adaptPaciente)  : AUD_PATIENTS);
      } catch {
        setIncidents(INCIDENTS);
        setPatients(AUD_PATIENTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = tab === "incidentes"
    ? (filter === "todas" ? incidents : incidents.filter(i => i.sev === filter))
    : patients;

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Auditoría &amp; Desempeño</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Supervisión de incidentes y control de calidad clínica.</div>
        </div>
        <div style={{ display:"flex", background:"#fff", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:4 }}>
          {["incidentes","pacientes"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:tab===t?"var(--text-dark)":"transparent", color:tab===t?"#fff":"var(--text-mid)", transition:"all .15s" }}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>Cargando datos...</div>
      ) : tab === "incidentes" ? (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            {["todas","leve","moderado","grave"].map(f => (
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:600, cursor:"pointer", border:"1.5px solid var(--border)", background:filter===f?"var(--text-dark)":"#fff", color:filter===f?"#fff":"var(--text-mid)", transition:"all .15s" }}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
            <button
              onClick={async () => {
                try {
                  const blob = await apiFetch(API.RH.EXPORT_PDF, { blob: true });
                  const url  = URL.createObjectURL(blob);
                  const a    = document.createElement("a");
                  a.href = url; a.download = "auditoria.pdf"; a.click();
                } catch (e) { alert("Error exportando: " + e.message); }
              }}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", borderRadius:"var(--radius-sm)", background:"#fff", border:"1.5px solid var(--border)", fontSize:13, fontWeight:600, cursor:"pointer", marginLeft:"auto" }}
            >
              <IcDoc c="var(--text-mid)" s={14}/> Exportar Reporte
            </button>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>Sin incidentes registrados</div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {filtered.map((inc, i) => (
                <div key={inc.id ?? i} style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:22, boxShadow:"var(--shadow-sm)", border:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:"#FFF3EB", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="var(--orange)"/></svg>
                      </div>
                      <div>
                        <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:700 }}>{inc.patient}</div>
                        <div style={{ fontSize:11, color:"var(--text-soft)", marginTop:1 }}>{inc.pid}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:11.5, color:"var(--text-soft)", textAlign:"right" }}>
                      <div>{inc.date}</div><div>{inc.time}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13.5, color:"var(--text-mid)", lineHeight:1.6, marginBottom:14 }}>{inc.desc}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>{inc.rInitial}</div>
                    <div>
                      <div style={{ fontSize:11.5, color:"var(--text-soft)" }}>Reportado por</div>
                      <div style={{ fontSize:12, fontWeight:600 }}>{inc.reporter}</div>
                    </div>
                    <div style={{ marginLeft:"auto" }}><Badge variant={inc.sev}>{inc.sev.toUpperCase()}</Badge></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Tab pacientes
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"#FAFBFC" }}>
              {["Paciente","Cama","Estado","Ficha"].map(h => <th key={h} style={{ padding:"12px 20px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)", borderBottom:"1px solid var(--border)" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.id ?? i}>
                  <td style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)" }}>
                    <div style={{ fontWeight:600 }}>{p.name}</div>
                    <div style={{ fontSize:12, color:"var(--text-soft)" }}>ID: {p.id}</div>
                  </td>
                  <td style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)" }}>
                    <span style={{ background:"var(--gray-bg)", padding:"4px 10px", borderRadius:8, fontWeight:600, fontSize:13 }}>{p.bed}</span>
                  </td>
                  <td style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)" }}>
                    <Badge variant={p.priority}>{p.raw?.estado_actual || p.priority}</Badge>
                  </td>
                  <td style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)" }}>
                    <button style={{ width:32, height:32, borderRadius:8, background:"var(--blue-light)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"none" }}>
                      <IcDoc c="var(--blue)" s={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
