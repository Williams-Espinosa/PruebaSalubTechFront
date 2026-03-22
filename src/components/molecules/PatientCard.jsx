import Badge from "../atoms/Badge";
import { IcArrow } from "../atoms/Icons";

export default function PatientCard({ patient, onAtender }) {
  const { name, dx, bed, priority, age, sex } = patient;
  return (
    <div style={{
      background:"#fff", borderRadius:"var(--radius-sm)", padding:20,
      boxShadow:"var(--shadow-sm)", border:"1px solid var(--border)", transition:"box-shadow .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
    >
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <Badge variant={priority}>Prioridad {priority}</Badge>
        <span style={{ fontSize:12, color:"var(--text-soft)" }}>{bed}</span>
      </div>
      <div style={{ fontFamily:"'TuFuente',sans-serif", fontSize:17, fontWeight:700, marginBottom:4 }}>{name}</div>
      <div style={{ fontSize:13, color:"var(--text-mid)", marginBottom:14 }}>{dx}</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:6 }}>
          <span style={{ background:"var(--gray-bg)", borderRadius:6, padding:"4px 8px", fontSize:12, fontWeight:600 }}>{age}a</span>
          <span style={{ background:"var(--gray-bg)", borderRadius:6, padding:"4px 8px", fontSize:12, fontWeight:600, color: sex==="F" ? "var(--red)" : undefined }}>{sex}</span>
        </div>
        <button
          onClick={() => onAtender(patient.id)}
          style={{ display:"flex", alignItems:"center", gap:4, color:"var(--blue)", fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:"transparent" }}
        >
          Atender <IcArrow c="var(--blue)" s={14}/>
        </button>
      </div>
    </div>
  );
}
