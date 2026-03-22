/**
 * @param {string} name  
 * @param {number} size   
 * @param {string} bg    
 */
export default function Avatar({ name = "", size = 36, bg = "var(--blue)", style = {} }) {
  const initials = name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'TuFuente',sans-serif", fontSize: size * 0.38,
      fontWeight: 700, color: "#fff", flexShrink: 0, ...style,
    }}>
      {initials || "?"}
    </div>
  );
}
