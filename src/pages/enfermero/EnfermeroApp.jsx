import { useState, useEffect } from "react";
import DashboardLayout from "../../components/templates/DashboardLayout";
import { IcActivity, IcClip, IcSwap } from "../../components/atoms/Icons";
import { fetchPacientes, fetchTareas, toggleTareaEstado } from "../../api/supabaseService";

import DashboardHome    from "./DashboardHome";
import RegistrosPage    from "./RegistrosPage";
import EntregaTurnoPage from "./EntregaTurnoPage";

const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard",     icon: c => <IcActivity c={c}/> },
  { id:"registros", label:"Registros",     icon: c => <IcClip c={c} s={16}/> },
  { id:"entrega",   label:"Entrega Turno", icon: c => <IcSwap c={c} s={16}/> },
];

export default function EnfermeroApp({ onLogout, user }) {
  const [section,  setSection]  = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [tasks,    setTasks]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [rawPacs, rawTareas] = await Promise.all([
          fetchPacientes(),
          fetchTareas(),
        ]);
        const pacs = rawPacs.map(p => ({
            id: p.id_paciente,
            name: p.nombre_completo,
            dx: p.diagnostico_ingreso || "ND",
            room: p.habitaciones?.numero_habitacion || p.id_habitacion,
            status: p.estado_actual.toLowerCase(),
        }));
        
        const tareas = rawTareas.map(t => ({
            id: t.id_tarea,
            patientId: t.id_paciente,
            patientName: t.pacientes?.nombre_completo || "Paciente",
            desc: t.descripcion_tarea,
            time: new Date(t.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            done: t.estado === 'Completada',
            rawEstado: t.estado,
        }));

        setPatients(pacs);
        setTasks(tareas);
        setSelectedPatientId(pacs[0]?.id ?? null);
      } catch (e) {
        console.error("Error cargando datos:", e.message);
        setPatients([]);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleTask = async (id) => {
    const targetTask = tasks.find(t => t.id === id);
    if (!targetTask) return;
    
    setTasks(p => p.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
    try {
      const nuevoEstado = await toggleTareaEstado(id, targetTask.rawEstado || (targetTask.done ? 'Completada' : 'Pendiente'));
      setTasks(p => p.map(t => t.id === id ? { ...t, rawEstado: nuevoEstado } : t));
    } catch (e) {
      console.warn("Toggle tarea:", e.message);
      setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
    }
  };

  const handleAtender = patientId => {
    setSelectedPatientId(patientId);
    setSection("registros");
  };

  return (
    <div className="page">
      <DashboardLayout
        navItems={NAV_ITEMS}
        activeSection={section}
        onSectionChange={setSection}
        onLogout={onLogout}
        userName={user?.nombre_completo || "Enfermero"}
        userRole="Enfermero"
        searchPlaceholder="Buscar paciente..."
      >
        {section === "dashboard" && (
          <DashboardHome
            tasks={tasks}
            patients={patients}
            loading={loading}
            onToggleTask={toggleTask}
            onAtender={handleAtender}
          />
        )}
        {section === "registros" && (
          <RegistrosPage
            patients={patients}
            initialPatientId={selectedPatientId}
          />
        )}
        {section === "entrega" && <EntregaTurnoPage onLogout={onLogout}/>}
      </DashboardLayout>
    </div>
  );
}
