import { IcShield } from "../atoms/Icons";

function Navbar({ stats }) {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px", height:64, background:"rgba(255,255,255,.9)", backdropFilter:"blur(12px)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:10, height:10, borderRadius:"50%", background:"var(--blue)" }}/>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:700 }}>SALUDTECH</div>
          <div style={{ fontSize:10, fontWeight:500, letterSpacing:1.2, color:"var(--text-soft)", textTransform:"uppercase" }}>Hospital Management System</div>
        </div>
      </div>
      {stats && (
        <div style={{ display:"flex", gap:40, alignItems:"center" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:40 }}>
              {i > 0 && <div style={{ width:1, background:"var(--border)", alignSelf:"stretch", margin:"16px 0" }}/>}
              <div>
                <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:18, fontWeight:800 }}>{s.val}</div>
                <div style={{ fontSize:9, fontWeight:600, letterSpacing:1.4, textTransform:"uppercase", color:"var(--text-soft)", marginTop:1, textAlign:"right" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

export default function LandingLayout({ stats, children }) {
  return (
    <div className="page">
      <Navbar stats={stats} />
      <div style={{ paddingTop: 64 }}>
        {children}
      </div>
    </div>
  );
}
