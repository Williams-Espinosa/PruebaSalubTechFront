import { IcSearch } from "../atoms/Icons";
import Avatar from "../atoms/Avatar";

/**
 * @param {string} userName
 * @param {string} userRole
 * @param {string} searchPlaceholder
 */
export default function Topbar({ userName = "Usuario", userRole = "Rol", searchPlaceholder = "Buscar..." }) {
  return (
    <div style={{ position:"sticky", top:0, zIndex:40, background:"#fff", borderBottom:"1px solid var(--border)", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--gray-bg)", borderRadius:"var(--radius-sm)", padding:"8px 16px", minWidth:260 }}>
        <IcSearch/>
        <input placeholder={searchPlaceholder} style={{ border:"none", outline:"none", background:"transparent", fontSize:13.5, color:"var(--text-dark)", fontFamily:"'DM Sans',sans-serif", flex:1 }}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:13, fontWeight:700 }}>{userName}</div>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)" }}>{userRole}</div>
        </div>
        <Avatar name={userName}/>
      </div>
    </div>
  );
}
