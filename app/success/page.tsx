"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Success() {
  const router = useRouter();
  const [streak, setStreak] = useState(1);
  const [eval_, setEval] = useState<any>(null);

  useEffect(() => {
    setStreak(parseInt(localStorage.getItem("youos_streak") || "1"));
    const e = localStorage.getItem("youos_last_eval");
    if (e) setEval(JSON.parse(e));
  }, []);

  const scoreColor = (s: number) => s >= 8 ? "#22C55E" : s >= 6 ? "#F2A23C" : "#EF4444";

  return (
    <main style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 20px", gap:"16px", textAlign:"center" }}>
      <div style={{ fontSize:"56px" }}>🔥</div>
      <div>
        <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:"96px", color:"#E85A1A", lineHeight:1 }}>{streak}</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", letterSpacing:"4px", color:"#333", textTransform:"uppercase", marginTop:"-6px" }}>Day Streak</div>
      </div>
      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:"38px", letterSpacing:"2px", lineHeight:1 }}>PROVED IT.</div>
      {eval_ && (
        <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:"6px", padding:"16px", width:"100%", maxWidth:"400px", textAlign:"left" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", letterSpacing:"4px", color:"#555", marginBottom:"12px" }}>PROOF EVALUATION</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", color:"#555" }}>SCORE</span>
            <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:"36px", color:scoreColor(eval_.score), lineHeight:1 }}>{eval_.score}/10</span>
          </div>
          {eval_.feedback?.was_gut && (
            <div style={{ marginBottom:"8px" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", color:"#22C55E", marginBottom:"4px" }}>✓ GUT</div>
              <p style={{ fontSize:"13px", color:"#888", lineHeight:1.6 }}>{eval_.feedback.was_gut}</p>
            </div>
          )}
          {eval_.improvement && (
            <div style={{ marginTop:"8px", padding:"10px", background:"#111", borderRadius:"4px" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", color:"#E85A1A", marginBottom:"4px" }}>NÄCHSTER SCHRITT</div>
              <p style={{ fontSize:"13px", color:"#F0EDE8", lineHeight:1.6 }}>{eval_.improvement}</p>
            </div>
          )}
        </div>
      )}
      <p style={{ fontSize:"14px", fontWeight:300, color:"#555", lineHeight:1.9 }}>
        Der nächste Schritt basiert<br/>auf deiner echten Handlung.
      </p>
      <button onClick={() => router.push("/execute")} style={{ background:"#E85A1A", border:"none", borderRadius:"6px", padding:"16px 32px", color:"#fff", fontFamily:"'Oswald',sans-serif", fontSize:"18px", letterSpacing:"4px", cursor:"pointer", marginTop:"8px" }}>
        NÄCHSTER SCHRITT →
      </button>
    </main>
  );
}
