// pages/public/HeroPage.jsx
import { useState } from "react";
import LandingLayout from "../../components/templates/LandingLayout";
import ConsentBanner from "../../components/organisms/ConsentBanner";
import { IcUsers, IcShield, IcArrow } from "../../components/atoms/Icons";

function HospitalImagePlaceholder() {
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#c7cfe8,#a8b4d8)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="20" width="60" height="50" rx="4" stroke="#6B7ABA" strokeWidth="2"/>
        <rect x="30" y="40" width="20" height="30" fill="#6B7ABA" opacity=".3"/>
        <rect x="20" y="30" width="10" height="10" rx="2" fill="#6B7ABA" opacity=".4"/>
        <rect x="50" y="30" width="10" height="10" rx="2" fill="#6B7ABA" opacity=".4"/>
        <line x1="40" y1="10" x2="40" y2="25" stroke="#6B7ABA" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="33" y1="17" x2="47" y2="17" stroke="#6B7ABA" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      <p style={{ color:"#6B7ABA", fontSize:13, fontWeight:500 }}>Imagen del hospital</p>
    </div>
  );
}

export default function HeroPage({ onStart, onPolicy }) {
  const [showCookie, setShowCookie] = useState(true);

  return (
    <LandingLayout stats={[{ val:"100%", label:"Seguridad Clínica" }]}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"calc(100vh - 64px)", overflow:"hidden" }}>
        {/* Left */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 64px", animation:"fadeUp .7s .1s ease both" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--blue-light)", borderRadius:100, padding:"6px 14px", marginBottom:28, fontSize:12, fontWeight:600, color:"var(--blue)", width:"fit-content" }}>
            <IcShield s={13}/> Sistema Hospitalario
          </div>
          <h1 style={{ fontFamily:"'TuFuente',sans-serif", fontSize:"clamp(36px,4vw,56px)", fontWeight:800, lineHeight:1.1, marginBottom:24, animation:"fadeUp .7s .15s ease both" }}>
            Gestión<br/>Inteligente de<br/><span style={{ color:"var(--blue)" }}>Cambios de<br/>Turno</span>
          </h1>
          <p style={{ fontSize:15, lineHeight:1.7, color:"var(--text-mid)", maxWidth:420, marginBottom:48, animation:"fadeUp .7s .2s ease both" }}>
            Optimiza la transferencia de información clínica crítica entre equipos médicos. Asegura que cada paciente reciba atención continua y de alta calidad.
          </p>
          <button
            onClick={onStart}
            style={{ display:"inline-flex", alignItems:"center", gap:18, background:"var(--blue)", borderRadius:"var(--radius)", padding:"20px 28px", cursor:"pointer", border:"none", textAlign:"left", boxShadow:"0 12px 32px rgba(61,91,245,.35)", transition:"transform .2s,box-shadow .2s,background .2s", animation:"fadeUp .7s .3s ease both", width:"fit-content" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.background="var(--blue-dark)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.background="var(--blue)"; }}
          >
            <div style={{ width:40, height:40, borderRadius:10, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><IcUsers/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:16, fontWeight:700, color:"#fff" }}>Iniciar Turno</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.7)", marginTop:2 }}>Validación de personal y relevo</div>
            </div>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}><IcArrow/></div>
          </button>
        </div>

        {/* Right */}
        <div style={{ position:"relative", overflow:"hidden", background:"linear-gradient(135deg,#E8ECFF,#D6DCFF)" }}>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 48px 60px 24px", animation:"fadeUp .7s .25s ease both" }}>
            <div style={{ width:"100%", maxWidth:480, borderRadius:24, overflow:"hidden", boxShadow:"var(--shadow-lg)", aspectRatio:"4/3" }}>
              <HospitalImagePlaceholder/>
            </div>
          </div>
        </div>
      </div>

      {showCookie && (
        <ConsentBanner
          onAccept={() => setShowCookie(false)}
          onReject={() => setShowCookie(false)}
          onPolicy={() => { setShowCookie(false); onPolicy(); }}
        />
      )}
    </LandingLayout>
  );
}
