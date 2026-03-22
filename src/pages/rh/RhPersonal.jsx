// pages/rh/RhPersonal.jsx
import { useState, useEffect } from "react";
import Button  from "../../components/atoms/Button";
import Badge   from "../../components/atoms/Badge";
import Modal   from "../../components/molecules/Modal";
import { IcUser, IcPlus, IcSearch } from "../../components/atoms/Icons";
import { apiFetch } from "../../api/client";
import { API } from "../../api/config";
import { adaptUsuario } from "../../api/adapters";
import { RH_STAFF } from "../../constants/mockData";

export default function RhPersonal() {
  const [staff,     setStaff]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [filter,    setFilter]    = useState("");
  const [form, setForm] = useState({
    nombre_completo:"", email:"", password:"", curp:"",
    rol:"Enfermero", turno_asignado:"Matutino"
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch(API.USUARIOS.LIST);
        setStaff(Array.isArray(data) ? data.map(adaptUsuario) : RH_STAFF);
      } catch {
        setStaff(RH_STAFF);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.nombre_completo || !form.email || !form.password || !form.curp) return;
    setSaving(true);
    try {
      // POST /api/v1/auth/register — crea el usuario con contraseña
      const data = await apiFetch(API.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify(form),
      });
      const nuevo = adaptUsuario(data.user || data);
      setStaff(p => [...p, nuevo]);
      setShowModal(false);
      setForm({ nombre_completo:"", email:"", password:"", curp:"", rol:"Enfermero", turno_asignado:"Matutino" });
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = staff.filter(s =>
    !filter ||
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.id_str?.toLowerCase().includes(filter.toLowerCase())
  );

  const inputStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"10px 13px", fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)", outline:"none" };

  return (
    <div style={{ padding:32, animation:"fadeUp .4s .05s ease both" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:22, fontWeight:800 }}>Personal del Hospital</div>
          <div style={{ fontSize:13, color:"var(--text-mid)", marginTop:4 }}>Administra los roles, turnos y altas del equipo médico.</div>
        </div>
        <Button onClick={() => setShowModal(true)}><IcPlus c="white" s={16}/> Registrar Empleado</Button>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", padding:"8px 14px", flex:1, maxWidth:400 }}>
          <IcSearch c="var(--text-soft)" s={14}/>
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filtrar por nombre o CURP..." style={{ border:"none", outline:"none", background:"transparent", fontSize:13.5, fontFamily:"'DM Sans',sans-serif", flex:1 }}/>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-soft)" }}>Cargando personal...</div>
      ) : (
        <div style={{ background:"#fff", borderRadius:"var(--radius-sm)", boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"#FAFBFC" }}>
              {["Colaborador","Rol","Turno","Estado","Acciones"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)", borderBottom:"1px solid var(--border)" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id ?? i}
                  onMouseEnter={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="var(--gray-bg)")}
                  onMouseLeave={e=>e.currentTarget.querySelectorAll("td").forEach(td=>td.style.background="")}
                >
                  <td style={{ padding:14, borderBottom:"1px solid var(--border)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:38, borderRadius:"50%", background:"var(--gray-bg)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><IcUser c="var(--text-soft)" s={16}/></div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{s.name}</div>
                        <div style={{ fontSize:11, color:"var(--text-soft)", marginTop:1 }}>{s.id_str}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:14, borderBottom:"1px solid var(--border)" }}>
                    <Badge variant={s.role}>{s.rolLabel || s.role}</Badge>
                  </td>
                  <td style={{ padding:14, fontWeight:500, borderBottom:"1px solid var(--border)" }}>{s.turno}</td>
                  <td style={{ padding:14, borderBottom:"1px solid var(--border)" }}>
                    <Badge variant={s.activo?"activo":"inactivo"}>{s.activo?"Activo":"Inactivo"}</Badge>
                  </td>
                  <td style={{ padding:14, borderBottom:"1px solid var(--border)" }}>
                    <button style={{ padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, border:"1.5px solid var(--border)", background:"#fff", cursor:"pointer" }}>Editar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding:32, textAlign:"center", color:"var(--text-soft)" }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Nuevo Colaborador" subtitle="Completa los datos para registrar al nuevo empleado." onClose={() => setShowModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {[["nombre_completo","Nombre Completo"],["email","Correo Electrónico"],["password","Contraseña"],["curp","CURP"]].map(([k,l]) => (
              <div key={k}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>{l}</label>
                <input style={inputStyle} type={k==="password"?"password":"text"} value={form[k]} onChange={set(k)} placeholder={l}/>
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Rol</label>
              <select style={{ ...inputStyle }} value={form.rol} onChange={set("rol")}>
                <option>Enfermero</option>
                <option>Supervisor</option>
                <option>RH</option>
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>Turno</label>
              <select style={{ ...inputStyle }} value={form.turno_asignado} onChange={set("turno_asignado")}>
                <option>Matutino</option>
                <option>Vespertino</option>
                <option>Nocturno</option>
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
            <button style={{ padding:"11px 24px", borderRadius:"var(--radius-sm)", background:"#fff", border:"1.5px solid var(--border)", fontSize:14, fontWeight:500, cursor:"pointer" }} onClick={() => setShowModal(false)}>Cerrar</button>
            <Button onClick={handleSave} disabled={saving || !form.nombre_completo || !form.email || !form.password || !form.curp}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
