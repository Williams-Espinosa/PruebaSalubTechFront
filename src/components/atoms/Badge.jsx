const colors = {
  alta:      { bg:"#FFF5F5", color:"var(--red)"    },
  media:     { bg:"#FFFAF0", color:"#D69E2E"       },
  baja:      { bg:"var(--green-light)", color:"var(--green)" },
  leve:      { bg:"var(--blue-light)",  color:"var(--blue)"  },
  moderado:  { bg:"#FFFAF0", color:"#D69E2E"       },
  grave:     { bg:"#FFF5F5", color:"var(--red)"    },
  success:   { bg:"var(--green-light)", color:"var(--green)" },
  blocked:   { bg:"#FFF5F5", color:"var(--red)"    },
  activo:    { bg:"var(--green-light)", color:"var(--green)" },
  inactivo:  { bg:"var(--gray-bg)",     color:"var(--text-soft)" },
  supervisor:{ bg:"#EDE9FE", color:"#7C3AED" },
  enfermero: { bg:"var(--blue-light)", color:"var(--blue)" },
  medico:    { bg:"var(--green-light)", color:"var(--green)" },
};

/**
 * @param {string} variant - clave en colors (alta, media, leve, success…)
 */
export default function Badge({ children, variant = "leve", style = {} }) {
  const c = colors[variant] ?? { bg:"var(--gray-bg)", color:"var(--text-mid)" };
  return (
    <span style={{
      display:"inline-block", padding:"3px 9px", borderRadius:6,
      fontSize:10, fontWeight:700, letterSpacing:.6, textTransform:"uppercase",
      background: c.bg, color: c.color, ...style,
    }}>
      {children}
    </span>
  );
}
