import { IcSteth, IcLogout } from "../atoms/Icons";

/**
 * @param {Array}    items   
 * @param {Array}    sections 
 * @param {string}   active   
 * @param {Function} onChange
 * @param {Function} onLogout
 */
export default function Sidebar({ items = [], sections = [], active, onChange, onLogout }) {
  const navItemStyle = isActive => ({
    display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
    borderRadius:"var(--radius-sm)", cursor:"pointer", fontSize:14,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? "var(--blue)" : "var(--text-mid)",
    background: isActive ? "var(--blue-light)" : "transparent",
    border:"none", width:"100%", textAlign:"left",
    transition:"background .15s, color .15s",
  });

  const renderItem = it => {
    const isActive = active === it.id;
    return (
      <button key={it.id} style={navItemStyle(isActive)} onClick={() => onChange(it.id)}>
        {it.icon(isActive ? "var(--blue)" : "var(--text-mid)")}
        {it.label}
      </button>
    );
  };

  return (
    <aside style={{ width:220, flexShrink:0, background:"#fff", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", padding:"24px 16px", position:"fixed", top:0, bottom:0, left:0, zIndex:50 }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 8px 24px", borderBottom:"1px solid var(--border)", marginBottom:24 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <IcSteth s={18}/>
        </div>
        <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:15, fontWeight:800 }}>HospTrack</div>
      </div>

      {}
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
        {sections.length > 0
          ? sections.map(sec => (
              <div key={sec.label} style={{ marginBottom:20 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.3, textTransform:"uppercase", color:"var(--text-soft)", padding:"0 12px", marginBottom:6 }}>
                  {sec.label}
                </div>
                {sec.items.map(renderItem)}
              </div>
            ))
          : items.map(renderItem)
        }
      </nav>

      {}
      <button onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:"var(--radius-sm)", cursor:"pointer", fontSize:13, fontWeight:600, color:"var(--red)", background:"transparent", border:"none", width:"100%", textAlign:"left", marginTop:8, transition:"background .15s" }}
        onMouseEnter={e=>e.currentTarget.style.background="#FFF5F5"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
      >
        <IcLogout/> Cerrar Sesión
      </button>
    </aside>
  );
}
