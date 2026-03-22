// pages/rh/RhDashHome.jsx
import { IcUsers, IcActivity, IcClock, IcDoc } from "../../components/atoms/Icons";
import { RH_ALERTS } from "../../constants/mockData";

function ActivityChart() {
  const days = ["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];
  const altas = [12,13,12,11,20,14,7];
  const incs  = [5,5,4,5,6,7,4];
  const W=500, H=180, pad=20, right=10;
  const xStep = (W-pad-right)/(days.length-1);
  const scaleY = v => H-pad-(v/24)*(H-pad*2);
  const ptA = altas.map((v,i) => `${pad+i*xStep},${scaleY(v)}`).join(" ");
  const ptI = incs.map((v,i)  => `${pad+i*xStep},${scaleY(v)}`).join(" ");
  const areaA = `M${pad},${scaleY(altas[0])} ` + altas.slice(1).map((v,i) => `L${pad+(i+1)*xStep},${scaleY(v)}`).join(" ") + ` L${pad+(altas.length-1)*xStep},${H} L${pad},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"100%" }} preserveAspectRatio="none">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3D5BF5" stopOpacity=".15"/><stop offset="100%" stopColor="#3D5BF5" stopOpacity="0"/></linearGradient></defs>
      <path d={areaA} fill="url(#ag)"/>
      <polyline points={ptA} fill="none" stroke="#3D5BF5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      <polyline points={ptI} fill="none" stroke="#E53E3E"  strokeWidth="2"   strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 3"/>
    </svg>
  );
}

export default function RhDashHome() {
  const stats = [
    { icon:<IcUsers c="var(--blue)"/>,    cls:"var(--blue-light)",  val:"142", label:"Colaboradores",    delta:"↑ +4 esta semana", up:true  },
    { icon:<IcActivity c="var(--green)"/>,cls:"var(--green-light)", val:"86",  label:"Pacientes Activos",delta:"↓ -2% ocupación",  up:false },
    { icon:<IcClock c="var(--orange)"/>,  cls:"#FFF3EB",            val:"03",  label:"Incidentes Hoy",   delta:"Gravedad: Leve",   up:null  },
    { icon:<IcDoc c="#7C3AED"/>,          cls:"#EDE9FE",            val:"28",  label:"Reportes PDF",     delta:"Generados este mes",up:null },
  ];
  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800, marginBottom:24 }}>Resumen General</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {stats.map((s,i) => (
          <div key={i} style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:"22px 20px", boxShadow:"var(--shadow-sm)" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:s.cls, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>{s.icon}</div>
            <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:28, fontWeight:800, marginBottom:4 }}>{s.val}</div>
            <div style={{ fontSize:13, color:"var(--text-mid)" }}>{s.label}</div>
            <div style={{ fontSize:11, fontWeight:600, marginTop:3, color: s.up===true?"var(--green)":s.up===false?"var(--red)":"var(--text-soft)" }}>
              {s.delta}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:28, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:16, fontWeight:700, marginBottom:4 }}>Actividad Semanal</div>
          <div style={{ fontSize:12, color:"var(--text-soft)", marginBottom:12 }}>Comparativa entre incidentes y altas médicas</div>
          <div style={{ display:"flex", gap:16, marginBottom:12 }}>
            {[["var(--blue)","Altas"],["var(--red)","Incidentes"]].map(([c,l]) => <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--text-mid)" }}><div style={{ width:10, height:10, borderRadius:"50%", background:c }}/>{l}</div>)}
          </div>
          <div style={{ height:180 }}><ActivityChart/></div>
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8 }}>
            {["Lun","Mar","Mie","Jue","Vie","Sab","Dom"].map(d=><span key={d} style={{ fontSize:11, color:"var(--text-soft)" }}>{d}</span>)}
          </div>
        </div>
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", padding:24, boxShadow:"var(--shadow-sm)" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:700, marginBottom:16 }}>Alertas Recientes</div>
          {RH_ALERTS.map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"var(--blue-light)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><IcClock c="var(--blue)" s={16}/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:600, marginBottom:2 }}>{a.name}</div>
                <div style={{ fontSize:11.5, color:"var(--text-soft)" }}>{a.source}</div>
              </div>
              <div style={{ fontSize:11, color:"var(--text-soft)", whiteSpace:"nowrap" }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
