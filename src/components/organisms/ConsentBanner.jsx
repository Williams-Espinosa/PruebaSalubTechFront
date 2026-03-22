import { IcConsent } from "../atoms/Icons";
import Button from "../atoms/Button";

export default function ConsentBanner({ onAccept, onReject, onPolicy }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center", padding:"0 24px 32px", pointerEvents:"none" }}>
      <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:"32px 36px", maxWidth:640, width:"100%", boxShadow:"var(--shadow-lg)", display:"flex", flexDirection:"column", gap:16, animation:"cookieDrop .5s .4s cubic-bezier(.22,1,.36,1) both", pointerEvents:"all" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, background:"var(--blue-light)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <IcConsent/>
          </div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:17, fontWeight:700 }}>Uso de Cookies en SaludTech</div>
        </div>
        <p style={{ fontSize:13.5, lineHeight:1.7, color:"var(--text-mid)" }}>
          Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra plataforma,
          personalizar contenido, analizar el tráfico y proporcionar funcionalidades de redes sociales.
          Al hacer clic en "Aceptar", aceptas el uso de todas las cookies.
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <Button onClick={onAccept}>Aceptar</Button>
          <Button variant="secondary" onClick={onReject}>Rechazar</Button>
        </div>
        <p style={{ fontSize:11.5, color:"var(--text-soft)" }}>
          Al continuar navegando, aceptas nuestra{" "}
          <span style={{ color:"var(--blue)", fontWeight:500, cursor:"pointer" }} onClick={onPolicy}>Política de Privacidad</span>.
        </p>
      </div>
    </div>
  );
}
