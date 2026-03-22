// pages/public/PrivacyPage.jsx
import LandingLayout from "../../components/templates/LandingLayout";
import Button from "../../components/atoms/Button";
import { IcShield, IcDoc, IcEye, IcLock, IcMail } from "../../components/atoms/Icons";

export default function PrivacyPage({ onBack }) {
  const sections = [
    { icon:<IcDoc/>, title:"1. Información que Recopilamos", body:"Recopilamos información necesaria para gestionar los cambios de turno del personal médico, incluyendo nombre, datos de contacto y horarios de trabajo." },
    { icon:<IcEye/>, title:"2. Uso de la Información", body:null, list:["Facilitar el intercambio de turnos entre profesionales","Enviar notificaciones sobre cambios de turno","Mejorar la experiencia del usuario"] },
    { icon:<IcLock c="var(--blue)" s={16}/>, title:"3. Protección de Datos", body:"Tus datos están cifrados y solo personal autorizado tiene acceso a ellos. No compartimos tu información con terceros sin tu consentimiento." },
    { icon:<IcShield s={16}/>, title:"4. Tus Derechos", body:"Tienes derecho a acceder, modificar o eliminar tu información personal en cualquier momento." },
  ];

  return (
    <LandingLayout stats={null}>
      <div style={{ minHeight:"calc(100vh - 64px)", padding:"60px 24px" }}>
        <div style={{ maxWidth:760, margin:"0 auto", background:"#fff", borderRadius:"var(--radius)", padding:"56px 64px", boxShadow:"var(--shadow-sm)", animation:"fadeUp .6s .1s ease both" }}>
          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"var(--blue-light)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
              <IcShield/>
            </div>
            <h1 style={{ fontFamily:"'TuFuente',sans-serif", fontSize:30, fontWeight:800 }}>Políticas de Privacidad</h1>
            <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:8 }}>Última actualización: 18 de febrero de 2026</p>
          </div>

          {/* Sections */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, marginBottom:32 }}>
            {sections.map((s, i) => (
              <div key={i}>
                <h3 style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  {s.icon} {s.title}
                </h3>
                {s.body && <p style={{ fontSize:13.5, lineHeight:1.75, color:"var(--text-mid)" }}>{s.body}</p>}
                {s.list && <ul style={{ paddingLeft:16, display:"flex", flexDirection:"column", gap:4 }}>{s.list.map((item,j)=><li key={j} style={{ fontSize:13.5, lineHeight:1.75, color:"var(--text-mid)" }}>{item}</li>)}</ul>}
              </div>
            ))}
            {/* Contact — full width */}
            <div style={{ gridColumn:"1/-1", textAlign:"center", borderTop:"1px solid var(--border)", paddingTop:32 }}>
              <h3 style={{ fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:12 }}>
                <IcMail/> 5. Contacto
              </h3>
              <p style={{ fontSize:13.5, color:"var(--text-mid)" }}>Puedes contactarnos en: <a href="mailto:privacidad@saludtech.com" style={{ color:"var(--blue)", fontWeight:500 }}>privacidad@saludtech.com</a></p>
            </div>
          </div>

          <div style={{ textAlign:"center", fontSize:12.5, color:"var(--text-soft)", lineHeight:1.7, padding:24, borderTop:"1px solid var(--border)" }}>
            Al utilizar SALUDTECH, aceptas estas políticas de privacidad. Nos reservamos el derecho de actualizarlas cuando sea necesario.
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginTop:32 }}>
            <Button onClick={onBack}>Volver al inicio</Button>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
