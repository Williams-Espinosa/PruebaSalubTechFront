import { useState, useEffect } from "react";
import Button  from "../../components/atoms/Button";
import Badge   from "../../components/atoms/Badge";
import Modal   from "../../components/molecules/Modal";
import { IcUser, IcPlus, IcSearch } from "../../components/atoms/Icons";
import { adaptUsuario } from "../../api/adapters";
import {
  fetchUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../api/supabaseService";

const EMPTY_FORM = {
  nombre_completo: "", email: "", password: "", curp: "",
  rol: "Enfermero", turno_asignado: "Matutino",
};

export default function RhPersonal() {
  const [staff,        setStaff]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState("");

  // ── Modales ──
  const [showCreate,   setShowCreate]   = useState(false);
  const [showEdit,     setShowEdit]     = useState(false);
  const [showDelete,   setShowDelete]   = useState(false);

  const [form,         setForm]         = useState({ ...EMPTY_FORM });
  const [editId,       setEditId]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving,       setSaving]       = useState(false);

  // ── Cargar usuarios desde Supabase ──
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsuarios();
        setStaff(data.map(adaptUsuario));
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // ── CREAR ──
  const handleCreate = async () => {
    if (!form.nombre_completo || !form.email || !form.password || !form.curp) return;
    setSaving(true);
    try {
      const created = await createUsuario(form);
      setStaff(prev => [...prev, adaptUsuario(created)]);
      setShowCreate(false);
      setForm({ ...EMPTY_FORM });
    } catch (e) {
      alert("Error al crear: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── EDITAR ──
  const openEdit = (s) => {
    setEditId(s.id);
    setForm({
      nombre_completo: s.raw.nombre_completo || "",
      email:           s.raw.email || "",
      password:        "",
      curp:            s.raw.curp || "",
      rol:             s.raw.rol || "Enfermero",
      turno_asignado:  s.raw.turno_asignado || "Matutino",
    });
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!form.nombre_completo || !form.email || !form.curp) return;
    setSaving(true);
    try {
      const campos = {
        nombre_completo: form.nombre_completo,
        email:           form.email,
        curp:            form.curp,
        rol:             form.rol,
        turno_asignado:  form.turno_asignado,
      };
      if (form.password) campos.password = form.password;

      const updated = await updateUsuario(editId, campos);
      setStaff(prev => prev.map(s => s.id === editId ? adaptUsuario(updated) : s));
      setShowEdit(false);
      setForm({ ...EMPTY_FORM });
      setEditId(null);
    } catch (e) {
      alert("Error al actualizar: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── ELIMINAR ──
  const openDelete = (s) => {
    setDeleteTarget(s);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteUsuario(deleteTarget.id);
      setStaff(prev => prev.filter(s => s.id !== deleteTarget.id));
      setShowDelete(false);
      setDeleteTarget(null);
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Filtrado ──
  const filtered = staff.filter(s =>
    !filter ||
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.id_str?.toLowerCase().includes(filter.toLowerCase())
  );

  const inputStyle = {
    width: "100%", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
    padding: "10px 13px", fontSize: 14, fontFamily: "'DM Sans',sans-serif",
    color: "var(--text-dark)", outline: "none",
  };

  const btnAction = (color, border) => ({
    padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
    border: `1.5px solid ${border}`, background: "#fff", cursor: "pointer",
    color, transition: "all .15s ease",
  });

  // ── Formulario reutilizable ──
  const renderForm = (isEdit) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      {[["nombre_completo","Nombre Completo"],["email","Correo Electrónico"],["curp","CURP"]].map(([k,l]) => (
        <div key={k}>
          <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>{l}</label>
          <input style={inputStyle} type="text" value={form[k]} onChange={set(k)} placeholder={l}/>
        </div>
      ))}
      <div>
        <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", color:"var(--text-soft)", marginBottom:7 }}>
          {isEdit ? "Nueva Contraseña (opcional)" : "Contraseña"}
        </label>
        <input style={inputStyle} type="password" value={form.password} onChange={set("password")} placeholder={isEdit ? "Dejar vacío para no cambiar" : "Contraseña"}/>
      </div>
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
  );

  return (
    <div style={{ padding: 32, animation: "fadeUp .4s .05s ease both" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'TuFuente',sans-serif", fontSize: 22, fontWeight: 800 }}>Personal del Hospital</div>
          <div style={{ fontSize: 13, color: "var(--text-mid)", marginTop: 4 }}>Administra los roles, turnos y altas del equipo médico.</div>
        </div>
        <Button onClick={() => { setForm({ ...EMPTY_FORM }); setShowCreate(true); }}><IcPlus c="white" s={16}/> Registrar Empleado</Button>
      </div>

      {/* Buscador */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 14px", flex: 1, maxWidth: 400 }}>
          <IcSearch c="var(--text-soft)" s={14}/>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filtrar por nombre o CURP..." style={{ border: "none", outline: "none", background: "transparent", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", flex: 1 }}/>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-soft)" }}>Cargando personal...</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#FAFBFC" }}>
              {["Colaborador","Rol","Turno","Estado","Acciones"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-soft)", borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id ?? i}
                  onMouseEnter={e => e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = "var(--gray-bg)")}
                  onMouseLeave={e => e.currentTarget.querySelectorAll("td").forEach(td => td.style.background = "")}
                >
                  <td style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--gray-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IcUser c="var(--text-soft)" s={16}/></div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 1 }}>{s.id_str}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                    <Badge variant={s.role}>{s.rolLabel || s.role}</Badge>
                  </td>
                  <td style={{ padding: 14, fontWeight: 500, borderBottom: "1px solid var(--border)" }}>{s.turno}</td>
                  <td style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                    <Badge variant={s.activo ? "activo" : "inactivo"}>{s.activo ? "Activo" : "Inactivo"}</Badge>
                  </td>
                  <td style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={btnAction("var(--blue)", "var(--border)")} onClick={() => openEdit(s)}>Editar</button>
                      <button style={btnAction("var(--red)", "#FEB2B2")} onClick={() => openDelete(s)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--text-soft)" }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal CREAR ── */}
      {showCreate && (
        <Modal title="Nuevo Colaborador" subtitle="Completa los datos para registrar al nuevo empleado." onClose={() => setShowCreate(false)}>
          {renderForm(false)}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={{ padding: "11px 24px", borderRadius: "var(--radius-sm)", background: "#fff", border: "1.5px solid var(--border)", fontSize: 14, fontWeight: 500, cursor: "pointer" }} onClick={() => setShowCreate(false)}>Cerrar</button>
            <Button onClick={handleCreate} disabled={saving || !form.nombre_completo || !form.email || !form.password || !form.curp}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Modal EDITAR ── */}
      {showEdit && (
        <Modal title="Editar Colaborador" subtitle="Modifica los datos del empleado. La contraseña es opcional." onClose={() => { setShowEdit(false); setEditId(null); }}>
          {renderForm(true)}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={{ padding: "11px 24px", borderRadius: "var(--radius-sm)", background: "#fff", border: "1.5px solid var(--border)", fontSize: 14, fontWeight: 500, cursor: "pointer" }} onClick={() => { setShowEdit(false); setEditId(null); }}>Cancelar</button>
            <Button onClick={handleUpdate} disabled={saving || !form.nombre_completo || !form.email || !form.curp}>
              {saving ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </Modal>
      )}

      {/* ── Modal ELIMINAR ── */}
      {showDelete && deleteTarget && (
        <Modal title="Confirmar Eliminación" onClose={() => { setShowDelete(false); setDeleteTarget(null); }}>
          <div style={{ fontSize: 14, color: "var(--text-mid)", marginBottom: 24, lineHeight: 1.6 }}>
            ¿Estás seguro de que deseas eliminar a <strong style={{ color: "var(--text-dark)" }}>{deleteTarget.name}</strong>?
            <br/>Esta acción no se puede deshacer.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button style={{ padding: "11px 24px", borderRadius: "var(--radius-sm)", background: "#fff", border: "1.5px solid var(--border)", fontSize: 14, fontWeight: 500, cursor: "pointer" }} onClick={() => { setShowDelete(false); setDeleteTarget(null); }}>Cancelar</button>
            <button
              onClick={handleDelete}
              disabled={saving}
              style={{ padding: "11px 24px", borderRadius: "var(--radius-sm)", background: "var(--red)", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
