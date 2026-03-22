/**
 * Button atom reutilizable.
 * variant: "primary" | "secondary" | "danger" | "ghost"
 */
export default function Button({ children, onClick, variant = "primary", disabled = false, fullWidth = false, style = {} }) {
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
    padding:"12px 24px", borderRadius:"var(--radius-sm)", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily:"'TuFuente',sans-serif", fontSize:14, fontWeight:700, border:"none",
    transition:"background .2s, transform .15s", width: fullWidth ? "100%" : undefined,
    opacity: disabled ? .55 : 1, ...style,
  };

  const variants = {
    primary:   { background:"var(--blue)",      color:"#fff", boxShadow:"0 8px 24px rgba(61,91,245,.25)" },
    secondary: { background:"#fff",             color:"var(--text-mid)", border:"1.5px solid var(--border)" },
    danger:    { background:"var(--red)",        color:"#fff" },
    ghost:     { background:"transparent",       color:"var(--blue)", border:"1.5px solid var(--blue)" },
    dark:      { background:"var(--text-dark)",  color:"#fff", boxShadow:"0 8px 24px rgba(15,27,61,.2)" },
  };

  return (
    <button style={{ ...base, ...variants[variant] }} onClick={disabled ? undefined : onClick} disabled={disabled}>
      {children}
    </button>
  );
}
