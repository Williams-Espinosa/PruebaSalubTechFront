import { useState, useEffect } from "react";
import Badge  from "../../components/atoms/Badge";
import { IcUser, IcClock, IcFilter } from "../../components/atoms/Icons";
import { fetchPacientes } from "../../api/supabaseService";

export default function SupRegistros() {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const PER_PAGE = 8;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPacientes();
        // Adaptar campos si es necesario
        setPatients((data || []).map(p => ({
          id: p.id_paciente,
          name: p.nombre_completo,
          age: p.edad || "N/D",
          bed: p.habitaciones?.numero_habitacion || p.id_habitacion || "N/A",
          dx: p.diagnostico_ingreso || "Nota de ingreso pendiente",
          priority: (p.prioridad || "baja").toLowerCase(),
          status: p.estado_actual || "Estable",
          updated: p.updated_at,
          raw: p
        })));
      } catch (err) {
        console.error("Error cargando pacientes para supervisor:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bed.toString().includes(searchTerm)
  );

  const paged   = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const hasNext = (page + 1) * PER_PAGE < filtered.length;
  const hasPrev = page > 0;

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Registros de Pacientes</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Historial completo y monitoreo de planta.</div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ position:"relative" }}>
            <input 
              placeholder="Buscar por nombre o cama..." 
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              style={{ padding:"10px 16px 10px 40px", borderRadius:10, border:"1.5px solid var(--border)", fontSize:13, outline:"none", width:240 }}
            />
            <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}><IcFilter s={16} c="var(--text-soft)"/></div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>Cargando pacientes...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>No se encontraron pacientes registrados.</div>
      ) : (
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#FAFBFC" }}>
                {["Paciente","Cama","Diagnóstico","Estado","Prioridad","Último Control"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)", borderBottom:"1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}
                  onMouseEnter={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="var(--gray-bg)")}
                  onMouseLeave={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="")}
                  style={{ transition:"background .15s" }}
                >
                  <td style={{ padding:16, borderBottom:"1px solid var(--border)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background: p.priority === "alta" ? "var(--red-light)" : "var(--gray-bg)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <IcUser c={p.priority === "alta" ? "var(--red)" : "var(--text-soft)"} s={14}/>
                      </div>
                      <div>
                        <div style={{ fontWeight:600 }}>{p.name}</div>
                        <div style={{ fontSize:12, color:"var(--text-soft)" }}>{p.age} años</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:16, fontWeight:600, borderBottom:"1px solid var(--border)" }}>{p.bed}</td>
                  <td style={{ padding:16, color:"var(--text-mid)", borderBottom:"1px solid var(--border)", fontSize:13 }}>{p.dx}</td>
                  <td style={{ padding:16, borderBottom:"1px solid var(--border)" }}>
                    <Badge variant={p.priority}>{p.status}</Badge>
                  </td>
                  <td style={{ padding:16, fontWeight:600, color:p.priority==="alta"?"var(--red)":p.priority==="media"?"#D69E2E":"var(--text-mid)", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                    {p.priority.charAt(0).toUpperCase()+p.priority.slice(1)}
                  </td>
                  <td style={{ padding:16, color:"var(--text-soft)", fontSize:12.5, borderBottom:"1px solid var(--border)", whiteSpace:"nowrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <IcClock c="var(--text-soft)" s={13}/>
                      {p.updated ? new Date(p.updated).toLocaleString("es-MX", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderTop:"1px solid var(--border)", fontSize:12, color:"var(--text-soft)" }}>
            <span>Mostrando {paged.length} de {filtered.length} pacientes</span>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setPage(p=>p-1)} disabled={!hasPrev} style={{ padding:"7px 16px", borderRadius:8, border:"1.5px solid var(--border)", background:"#fff", fontSize:13, fontWeight:500, cursor:hasPrev?"pointer":"not-allowed", opacity:hasPrev?1:.4 }}>Anterior</button>
              <button onClick={()=>setPage(p=>p+1)} disabled={!hasNext} style={{ padding:"7px 16px", borderRadius:8, border:"1.5px solid var(--border)", background:"#fff", fontSize:13, fontWeight:500, cursor:hasNext?"pointer":"not-allowed", opacity:hasNext?1:.4 }}>Siguiente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
