// pages/rh/RhRegistros.jsx
import { useState, useEffect } from "react";
import { IcDoc, IcClock } from "../../components/atoms/Icons";
import { apiFetch } from "../../api/client";
import { API } from "../../api/config";
import { adaptNota } from "../../api/adapters";
import { BIT_LOGS } from "../../constants/mockData";

export default function RhRegistros() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Usa notas generales como bitácora
        const data = await apiFetch(API.NOTAS.LIST);
        if (Array.isArray(data) && data.length) {
          // Adapta notas como entradas de bitácora
          setLogs(data.map(n => ({
            event:  n.tipo_evento  || "Registro",
            user:   n.enfermero    || "Sistema",
            ts:     n.fecha_hora   ? new Date(n.fecha_hora).toLocaleString("es-MX") : "",
            status: n.urgencia     ? "blocked" : "success",
          })));
        } else {
          setLogs(BIT_LOGS);
        }
      } catch {
        setLogs(BIT_LOGS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleExportXLS = async () => {
    setExporting(true);
    try {
      const blob = await apiFetch(API.RH.EXPORT_XLS, { blob: true });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "Reporte_Personal_RH.xlsx"; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Error exportando: " + e.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:8 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:20, fontWeight:800 }}>Bitácora de Sistema</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Registros generales de notas y eventos clínicos.</div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"8px 14px", fontSize:13, fontWeight:600 }}>
            <IcClock c="var(--text-mid)" s={14}/> {new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}
          </div>
          <button onClick={handleExportXLS} disabled={exporting} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:"var(--radius-sm)", background:"var(--text-dark)", color:"#fff", border:"none", fontSize:13, fontWeight:700, cursor: exporting?"not-allowed":"pointer", opacity: exporting?.6:1 }}>
            <IcDoc c="white" s={14}/> {exporting ? "Exportando..." : "Exportar XLS"}
          </button>
        </div>
      </div>

      <div style={{ marginBottom:20, marginTop:16 }}>
        <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:6, fontSize:10, fontWeight:700, background:"var(--green-light)", color:"var(--green)" }}>Sistema Operativo</span>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>Cargando registros...</div>
      ) : (
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"#FAFBFC" }}>
              {["Evento","Usuario / Módulo","Timestamp","Estado"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)", borderBottom:"1px solid var(--border)" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i}
                  onMouseEnter={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="var(--gray-bg)")}
                  onMouseLeave={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="")}
                >
                  <td style={{ padding:16, fontWeight:600, borderBottom:"1px solid var(--border)" }}>{l.event}</td>
                  <td style={{ padding:16, color:"var(--text-mid)", borderBottom:"1px solid var(--border)" }}>{l.user}</td>
                  <td style={{ padding:16, color:"var(--text-soft)", fontSize:12.5, borderBottom:"1px solid var(--border)" }}>{l.ts}</td>
                  <td style={{ padding:16, borderBottom:"1px solid var(--border)" }}>
                    <span style={{ display:"inline-block", padding:"3px 8px", borderRadius:6, fontSize:10, fontWeight:800, letterSpacing:.6, textTransform:"uppercase", background:l.status==="success"?"var(--green-light)":"#FFF5F5", color:l.status==="success"?"var(--green)":"var(--red)" }}>
                      {l.status?.toUpperCase()}
                    </span>
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
