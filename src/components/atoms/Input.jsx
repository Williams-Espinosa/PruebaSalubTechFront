import { useState } from "react";

/**
 * @param {ReactNode} icon   
 * @param {string}    type   
 */
export default function Input({ icon, placeholder, value, onChange, type = "text", onKeyDown, style = {} }) {
  return (
    <div style={{
      display:"flex", alignItems:"center",
      border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)",
      overflow:"hidden", transition:"border-color .2s",
      ...style,
    }}
      onFocus={e => e.currentTarget.style.borderColor = "var(--blue)"}
      onBlur={e  => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {icon && <div style={{ padding:"0 12px", color:"var(--text-soft)", display:"flex", alignItems:"center" }}>{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={{
          flex:1, border:"none", outline:"none",
          padding: icon ? "12px 12px 12px 0" : "12px 14px",
          fontSize:14, fontFamily:"'DM Sans',sans-serif", color:"var(--text-dark)",
          background:"transparent",
        }}
      />
    </div>
  );
}
