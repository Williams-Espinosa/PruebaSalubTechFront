import { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import { IcSearch, IcClock, IcDoc, IcCheckCircle, IcCheck } from "../../components/atoms/Icons";
import { fetchTurnosParaValidar, validarTurno } from "../../api/supabaseService";

export default function ValidarGuardia() {
  const [turnos,   setTurnos]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [firma,    setFirma]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTurnosParaValidar();
        setTurnos(data || []);
      } catch (err) {
        console.error("Error cargando turnos para validar:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleValidar = async () => {
    if (!firma || selected === null) return;
    const turnoId = turnos[selected].id_turno;
    setSaving(true);
    try {
      await validarTurno(turnoId, firma);
      alert("Guardia validada y firmada exitosamente.");
      // Actualizar lista local
      setTurnos(prev => prev.filter((_, i) => i !== selected));
      setSelected(null);
      setFirma("");
    } catch (err) {
      alert("Error al validar guardia: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = turnos.filter(t => 
    t.usuarios?.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id_turno.toString().includes(searchTerm)
  );

  const rep = (selected !== null && filtered[selected]) ? filtered[selected] : null;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", minHeight:"calc(100vh - 64px)" }}>
      {/* Left */}
      <div style={{ borderRight:"1px solid var(--border)", background:"#fff", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:20 }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:18, fontWeight:800, marginBottom:4 }}>Validar Cierre de Guardia</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginBottom:16 }}>Revisión y firma legal de reportes de entrega de turno.</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--gray-bg)", borderRadius:"var(--radius-sm)", padding:"8px 14px" }}>
            <IcSearch/>
            <input 
               placeholder="Buscar reporte o enfermero..." 
               style={{ border:"none", outline:"none", background:"transparent", fontSize:13, fontFamily:"'DM Sans',sans-serif", flex:1 }}
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"0 12px 12px" }}>
          {loading ? (
            <div style={{ padding:20, color:"var(--text-soft)", fontSize:13 }}>Cargando reportes...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding:20, color:"var(--text-soft)", fontSize:13 }}>No hay guardias pendientes</div>
          ) : filtered.map((r,i) => (
            <div key={r.id_turno} onClick={()=>setSelected(i)} style={{ borderRadius:"var(--radius-sm)", padding:16, marginBottom:8, cursor:"pointer", border:`1.5px solid ${selected===i?"var(--blue)":"transparent"}`, background:selected===i?"var(--blue-light)":"transparent", transition:"all .15s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:.8, color:"var(--blue)" }}>REP-{r.id_turno}</span>
                <span style={{ fontSize:11, color:"var(--text-soft)", display:"flex", alignItems:"center", gap:4 }}>
                  <IcClock c="var(--text-soft)" s={11}/> {new Date(r.hora_inicio).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:4 }}>{r.usuarios?.nombre_completo}</div>
              <div style={{ fontSize:12, color:"var(--text-mid)", marginBottom:6 }}>Piso de atención · {r.tipo_turno}</div>
              {r.observaciones && <div style={{ fontSize:11.5, fontWeight:600, color:"var(--orange)" }}>Pendientes registrados</div>}
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
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:20, fontWeight:800, marginBottom:4 }}>Reporte REP-{rep.id_turno} — {rep.usuarios?.nombre_completo}</div>
              <div style={{ fontSize:13, color:"var(--text-mid)" }}>{rep.usuarios?.rol} · Iniciado a las {new Date(rep.hora_inicio).toLocaleString()}</div>
            </div>
            
            <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:20, boxShadow:"var(--shadow-sm)", marginBottom:20 }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                <IcCheckCircle c="var(--blue)" s={16}/> Resumen del Turno
              </div>
              <div style={{ fontSize:13, lineHeight:1.6, color:"var(--text-dark)", padding:"12px", background:"var(--gray-bg)", borderRadius:8 }}>
                {rep.observaciones || "Sin observaciones adicionales registradas durante este turno."}
              </div>
            </div>

            <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)" }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, marginBottom:14 }}>Firma y Validación del Supervisor</div>
              <p style={{ fontSize:12.5, color:"var(--text-soft)", marginBottom:16 }}>Al firmar este reporte, usted valida que la entrega de turno se realizó bajo los protocolos hospitalarios HT-S2 y que los pendientes han sido comunicados.</p>
              <input 
                value={firma} 
                onChange={e=>setFirma(e.target.value)} 
                placeholder="Nombre completo o PIN del supervisor" 
                style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"11px 14px", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:12 }}
              />
              <Button fullWidth onClick={handleValidar} disabled={!firma || saving}>
                {saving ? "Validando..." : <><IcCheck c="white" s={16}/> Validar y Firmar Reporte</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
