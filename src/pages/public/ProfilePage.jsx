// pages/public/ProfilePage.jsx
import LandingLayout from "../../components/templates/LandingLayout";
import { IcClip, IcSteth, IcUsers, IcLock } from "../../components/atoms/Icons";

const PROFILES = [
  { role:"enfermero",  name:"Enfermero",  desc:"Registro clínico, triaje y administración de pacientes.", icon:<IcSteth/> },
  { role:"supervisor", name:"Supervisor", desc:"Monitoreo de flujo hospitalario y gestión de camas.",     icon:<IcClip/>  },
  { role:"rh",         name:"RH",         desc:"Gestión de turnos, nómina y expedientes del personal.",   icon:<IcUsers/> },
];

export default function ProfilePage({ onSelect }) {
  return (
    <LandingLayout stats={null}>
      <div style={{ minHeight:"calc(100vh - 64px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 24px" }}>
        {/* Logo */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginBottom:8, animation:"fadeUp .6s .05s ease both" }}>
          <div style={{ width:64, height:64, borderRadius:18, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(61,91,245,.35)" }}>
            <IcSteth s={28}/>
          </div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:26, fontWeight:800 }}>
            Salud<span style={{ color:"var(--blue)" }}>Tech</span>
          </div>
        </div>
        <p style={{ fontSize:14, color:"var(--text-mid)", marginBottom:40, animation:"fadeUp .6s .1s ease both" }}>
          Selecciona tu perfil para iniciar sesión
        </p>

        {/* Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,260px)", gap:24 }}>
          {PROFILES.map((p, i) => (
            <div
              key={p.role}
              onClick={() => onSelect(p.role)}
              style={{ background:"#fff", borderRadius:"var(--radius)", overflow:"hidden", boxShadow:"var(--shadow-sm)", cursor:"pointer", border:"1.5px solid transparent", transition:"transform .22s,box-shadow .22s,border-color .22s", animation:`fadeUp .6s ${.15 + i*.07}s ease both` }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; e.currentTarget.style.borderColor="var(--blue)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="var(--shadow-sm)"; e.currentTarget.style.borderColor="transparent"; }}
            >
              <div style={{ height:110, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>{p.icon}</div>
              </div>
              <div style={{ padding:24, textAlign:"center" }}>
                <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:18, fontWeight:700, marginBottom:8 }}>{p.name}</div>
                <div style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.6 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop:48, display:"flex", flexDirection:"column", alignItems:"center", gap:6, animation:"fadeUp .6s .35s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, fontWeight:700, letterSpacing:1.4, textTransform:"uppercase", color:"var(--text-soft)" }}>
            <IcLock/> Acceso restringido a personal autorizado
          </div>
          <div style={{ fontSize:12, color:"var(--text-soft)" }}>© 2026 HospTrack Systems. Seguridad de datos de grado médico.</div>
        </div>
      </div>
    </LandingLayout>
  );
}
