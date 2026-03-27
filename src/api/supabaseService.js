import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

export const loginUser = async (email, password) => {
  // 1. Buscar al usuario en la tabla "usuarios" por email
  const { data: user, error: userError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error('Usuario no encontrado:', userError);
    throw new Error('Credenciales incorrectas');
  }

  // 2. Verificar que el usuario esté activo
  if (!user.activo) {
    throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
  }

  // 3. Comparar la contraseña ingresada con el hash almacenado
  const passwordValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordValid) {
    throw new Error('Credenciales incorrectas');
  }

  return user;
};

// ── CRUD Usuarios ──────────────────────────────────────

export const fetchUsuarios = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('nombre_completo');

  if (error) throw error;
  return data;
};

export const createUsuario = async ({ nombre_completo, email, password, curp, rol, turno_asignado }) => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre_completo, email, password_hash, curp, rol, turno_asignado, activo: true }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUsuario = async (id, campos) => {
  const updateData = { ...campos };

  // Si se envía una contraseña nueva, hashearla
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password_hash = await bcrypt.hash(updateData.password, salt);
    delete updateData.password;
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update(updateData)
    .eq('id_usuario', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUsuario = async (id) => {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id_usuario', id);

  if (error) throw error;
};

export const fetchPacientes = async () => {
  const { data, error } = await supabase
    .from('pacientes')
    .select(`
      *,
      habitaciones ( numero_habitacion, piso )
    `);
  
  if (error) throw error;
  return data;
};

export const fetchTareas = async () => {
  const { data, error } = await supabase
    .from('tareas')
    .select(`
      *,
      pacientes ( nombre_completo )
    `);

  if (error) throw error;
  return data;
};

export const toggleTareaEstado = async (id, currentEstado) => {
  const nuevoEstado = currentEstado === 'Completada' ? 'Pendiente' : 'Completada';
  const { error } = await supabase
    .from('tareas')
    .update({ estado: nuevoEstado })
    .eq('id_tarea', id);
  
  if (error) throw error;
  return nuevoEstado;
};

// ── Notas ──────────────────────────────────────────────

export const fetchNotas = async () => {
  const { data, error } = await supabase
    .from('notas')
    .select('*')
    .order('fecha_hora', { ascending: false });

  if (error) throw error;
  return data;
};

export const createNota = async ({ id_paciente, tipo_nota, descripcion, urgencia, enfermero }) => {
  const { data, error } = await supabase
    .from('notas')
    .insert([{
      id_paciente,
      tipo_nota: tipo_nota || 'Nota de evolución',
      descripcion,
      urgencia: urgencia || false,
      enfermero: enfermero || 'Enfermero',
      fecha_hora: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── Dashboard Stats ────────────────────────────────────

export const fetchDashboardStats = async () => {
  const [usuarios, pacientes, notasHoy] = await Promise.all([
    supabase.from('usuarios').select('id_usuario', { count: 'exact', head: true }),
    supabase.from('pacientes').select('id_paciente', { count: 'exact', head: true }),
    supabase.from('notas').select('id_nota', { count: 'exact', head: true })
      .gte('fecha_hora', new Date(new Date().setHours(0,0,0,0)).toISOString()),
  ]);

  return {
    totalUsuarios: usuarios.count ?? 0,
    totalPacientes: pacientes.count ?? 0,
    notasHoy: notasHoy.count ?? 0,
  };
};

// ── Turnos / Entregas ──────────────────────────────────

export const fetchTurnosRecientes = async () => {
  const { data, error } = await supabase
    .from('turnos')
    .select('*, usuarios ( nombre_completo )')
    .order('hora_inicio', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

export const createEntregaTurno = async ({ id_usuario, tipo_turno, observaciones }) => {
  const { data, error } = await supabase
    .from('turnos')
    .insert([{
      id_usuario,
      tipo_turno,
      hora_inicio: new Date().toISOString(),
      estado: 'activo',
      observaciones,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ── Supervisor / Medico ────────────────────────────────

export const fetchTurnosParaValidar = async () => {
  const { data, error } = await supabase
    .from('turnos')
    .select('*, usuarios ( nombre_completo, rol )')
    .eq('estado', 'activo') // O 'finalizado' si hay un estado intermedio
    .order('hora_inicio', { ascending: false });

  if (error) throw error;
  return data;
};

export const validarTurno = async (id, firma) => {
  const { data, error } = await supabase
    .from('turnos')
    .update({ 
      estado: 'validado', 
      validado_por: firma,
      hora_fin: new Date().toISOString() 
    })
    .eq('id_turno', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};


