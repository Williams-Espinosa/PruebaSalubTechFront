import { IcCheck } from "../atoms/Icons";

export default function TaskItem({ task, onToggle }) {
  const { cat, time, name, patient, done } = task;
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
      <div
        onClick={() => onToggle(task.id)}
        style={{
          width:18, height:18, borderRadius:"50%",
          border: `2px solid ${done ? "var(--green)" : "var(--border)"}`,
          background: done ? "var(--green)" : "transparent",
          flexShrink:0, marginTop:2, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all .15s",
        }}
      >
        {done && <IcCheck s={10}/>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--text-soft)" }}>
          {cat}<span style={{ fontWeight:600, color:"var(--text-mid)" }}>{time}</span>
        </div>
        <div style={{ fontSize:13.5, fontWeight:500, marginTop:3, color: done ? "var(--text-soft)" : "var(--text-dark)", textDecoration: done ? "line-through" : "none" }}>{name}</div>
        <div style={{ fontSize:11.5, color:"var(--text-soft)", marginTop:2 }}>{patient}</div>
      </div>
    </div>
  );
}
