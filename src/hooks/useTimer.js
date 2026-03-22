import { useState, useEffect } from "react";

/**
 * @param {number} initialSeconds 
 * @returns {string} 
 */
export function useTimer(initialSeconds = 6 * 3600 + 45 * 60 + 12) {
  const [secs, setSecs] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => setSecs(v => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const h   = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m   = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const sec = String(secs % 60).padStart(2, "0");
  return `${h} : ${m} : ${sec}`;
}
