// pages/public/LoginPage.jsx
import { useState } from "react";
import { IcSteth, IcUser, IcLock, IcShield, IcArrow, IcArrowL } from "../../components/atoms/Icons";
import Button from "../../components/atoms/Button";
import Input  from "../../components/atoms/Input";
import { apiFetch, setToken } from "../../api/client";
import { API } from "../../api/config";

const ROLE_LABELS = {
  enfermero:  "Acceso Para Enfermeros y Enfermeras",
  supervisor: "Acceso Administrativo para Médicos y Supervisores",
  rh:         "Acceso Administrativo para Recursos Humanos",
};

// Mapea el rol del backend al rol interno del frontend
const BACKEND_ROL_MAP = {
  "Enfermero":  "enfermero",
  "Supervisor": "supervisor",
  "RH":         "rh",
};

export default function LoginPage({ role, onBack, onLogin }) {
  const [email,    setEmail]   = useState("");
  const [password, setPassword]= useState("");
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(API.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Guarda el token
      setToken(data.token);

      // Determina el rol recibido del backend
      const backendRol = data.user?.rol;
      const frontendRol = BACKEND_ROL_MAP[backendRol] || role;

      onLogin(frontendRol, data.user);
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"linear-gradient(135deg,#e8f0fe 0%,#d4e3fc 40%,#e8f5e9 100%)", position:"relative" }}>
      <button
        onClick={onBack}
        style={{ position:"absolute", top:24, left:24, width:44, height:44, borderRadius:"50%", background:"var(--blue)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(61,91,245,.4)", transition:"transform .2s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
        onMouseLeave={e=>e.currentTarget.style.transform="none"}
      >
        <IcArrowL/>
      </button>

      <div style={{ background:"#fff", borderRadius:"var(--radius)", overflow:"hidden", width:"100%", maxWidth:420, boxShadow:"var(--shadow-lg)", animation:"fadeUp .5s .1s ease both" }}>
        {/* Header */}
        <div style={{ background:"var(--blue)", padding:"36px 32px 32px", textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,255,255,.2)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
              <IcSteth s={28}/>
            </div>
          </div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800, color:"#fff" }}>SaludTech</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", marginTop:6 }}>{ROLE_LABELS[role]}</div>
        </div>

        {/* Body */}
        <div style={{ padding:32, display:"flex", flexDirection:"column", gap:20 }}>
          {error && (
            <div style={{ background:"#FFF5F5", border:"1px solid #FEB2B2", borderRadius:"var(--radius-sm)", padding:"10px 14px", fontSize:13, color:"var(--red)", display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ {error}
            </div>
          )}
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.3, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Correo Electrónico</label>
            <Input icon={<IcUser/>} placeholder="correo@hospital.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          </div>
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.3, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:8 }}>Contraseña</label>
            <Input icon={<IcLock s={16} c="var(--text-soft)"/>} placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          </div>
          <div style={{ fontSize:12, color:"var(--blue)", textAlign:"right", cursor:"pointer", fontWeight:500 }}>¿Olvidaste tu contraseña?</div>
          <Button onClick={handleLogin} fullWidth disabled={!email || !password || loading}>
            {loading ? "Iniciando sesión..." : <><span>Iniciar Sesión</span> <IcArrow s={18}/></>}
          </Button>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:11, fontWeight:600, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)" }}>
            <IcShield s={14}/> Sistema de Seguridad Encriptada
          </div>
        </div>
        <div style={{ textAlign:"center", padding:16, borderTop:"1px solid var(--border)", fontSize:11.5, color:"var(--text-soft)" }}>
          © 2026 MedControl Systems. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
