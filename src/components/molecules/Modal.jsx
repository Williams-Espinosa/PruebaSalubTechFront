export default function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(15,27,61,.35)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn .2s ease" }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <div style={{ background:"#fff", borderRadius:"var(--radius)", padding:36, width:"100%", maxWidth:560, boxShadow:"var(--shadow-lg)", animation:"fadeUp .25s ease both", position:"relative", maxHeight:"90vh", overflowY:"auto" }}>
        {onClose && (
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:32, height:32, borderRadius:"50%", background:"var(--gray-bg)", border:"none", cursor:"pointer", fontSize:18, color:"var(--text-mid)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ×
          </button>
        )}
        {title    && <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:20, fontWeight:800, marginBottom:4 }}>{title}</div>}
        {subtitle && <div style={{ fontSize:13, color:"var(--text-mid)", marginBottom:24 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}
