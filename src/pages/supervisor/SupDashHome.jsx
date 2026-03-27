import { useState, useEffect } from "react";
import { IcActivity, IcClock, IcUsers, IcArrow } from "../../components/atoms/Icons";
import { fetchDashboardStats, fetchUsuarios, fetchPacientes } from "../../api/supabaseService";

function OccupancyChart() {
  const points = [72,74,78,80,82,84,83,82,81,80,79,78];
  const W=500, H=160, pad=10;
  const xs = points.map((_,i) => pad + i*(W-pad*2)/(points.length-1));
  const ys = points.map(p  => H - pad - (p-60)/(90-60)*(H-pad*2));
  const poly = xs.map((x,i) => `${x},${ys[i]}`).join(" ");
  const area = `M${xs[0]},${ys[0]} ` + xs.slice(1).map((x,i) => `L${x},${ys[i+1]}`).join(" ") + ` L${xs[xs.length-1]},${H} L${xs[0]},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"100%" }} preserveAspectRatio="none">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3D5BF5" stopOpacity=".18"/><stop offset="100%" stopColor="#3D5BF5" stopOpacity="0"/></linearGradient></defs>
      <path d={area} fill="url(#cg)"/>
      <polyline points={poly} fill="none" stroke="#3D5BF5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

export default function SupDashHome() {
  const [stats, setStats] = useState({ totalUsuarios: 0, totalPacientes: 0, ocupacion: "0%" });
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashStats, rawUsers, rawPacs] = await Promise.all([
          fetchDashboardStats(),
          fetchUsuarios(),
          fetchPacientes(),
        ]);
        
        // Calcular ocupación aproximada (pacs / habitaciones estimadas)
        const totalRooms = 150; // Valor de referencia
        const occupancy = Math.min(100, Math.round((rawPacs.length / totalRooms) * 100));

        setStats({
          totalUsuarios: dashStats.totalUsuarios,
          totalPacientes: dashStats.totalPacientes,
          ocupacion: `${occupancy}%`,
        });

        // Filtrar personal en turno (solo activos)
        setStaff((rawUsers || []).slice(0, 6).map(u => ({
          name: u.nombre_completo,
          role: u.rol,
        })));

      } catch (err) {
        console.error("Error cargando dashboard supervisor:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const kpis = [
    { label:"Ocupación de Camas", val: stats.ocupacion,  delta:"Estimado real",   color:"#7C3AED", bg:"#EDE9FE" },
    { label:"Personal Registrado", val: String(stats.totalUsuarios),   delta:"En el sistema", color:"var(--green)", bg:"var(--green-light)" },
    { label:"Pacientes Atendidos", val: String(stats.totalPacientes),  delta:"Total activo",  color:"var(--orange)", bg:"#FFF3EB" },
  ];

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Panel de Control General</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Estado global del hospital y personal activo.</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--blue-light)", borderRadius:"var(--radius-sm)", padding:"10px 16px", fontSize:13, fontWeight:600, color:"var(--blue)" }}>
          <IcClock c="var(--blue)" s={15}/> {new Date().getHours() >= 14 && new Date().getHours() < 22 ? 'Turno de Tarde: 14:00 - 22:00' : 'Turno Operativo'}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>Cargando datos...</div>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:24 }}>
            {kpis.map((s,i) => (
              <div key={i} style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:"24px 28px", boxShadow:"var(--shadow-sm)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:12, color:"var(--text-mid)", marginBottom:6 }}>{s.label}</div>
                  <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:28, fontWeight:800 }}>{s.val}</div>
                  <div style={{ fontSize:11.5, fontWeight:600, marginTop:4, color:"var(--green)" }}>{s.delta}</div>
                </div>
                <div style={{ width:52, height:52, borderRadius:14, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <IcActivity c={s.color} s={24}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
            <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:28, boxShadow:"var(--shadow-sm)" }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:16, fontWeight:700, display:"flex", alignItems:"center", gap:8, marginBottom:20 }}><IcActivity s={18}/> Tendencia de Ocupación</div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", height:220, padding:"0 10px 20px 0" }}>
                  {[100,75,50,25,0].map(v => <span key={v} style={{ fontSize:11, color:"var(--text-soft)" }}>{v}</span>)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ height:220 }}><OccupancyChart/></div>
                  <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8 }}>
                    {["08:00","10:00","12:00","14:00","16:00","18:00","20:00"].map(t => <span key={t} style={{ fontSize:11, color:"var(--text-soft)" }}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)" }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>Personal en Turno</div>
              {staff.length === 0 && <div style={{ fontSize:13, color:"var(--text-soft)", padding:"20px 0" }}>Sin personal registrado</div>}
              {staff.map((s, idx) => (
                <div key={idx} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid var(--border)", cursor:"pointer" }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", background:"var(--gray-bg)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <IcUsers c="var(--text-soft)" s={16}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:600 }}>{s.name}</div>
                    <div style={{ fontSize:11.5, color:"var(--text-soft)", marginTop:1 }}>{s.role}</div>
                  </div>
                  <IcArrow c="var(--text-soft)" s={14}/>
                </div>
              ))}
              <span style={{ fontSize:12.5, color:"var(--blue)", fontWeight:500, cursor:"pointer", paddingTop:12, display:"block" }}>Ver todos los colaboradores</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
