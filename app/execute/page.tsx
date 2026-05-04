"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Execute() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<"plan"|"timer"|"proof">("plan");
  const [proof, setProof] = useState("");
  const [proofFile, setProofFile] = useState("");
  const [tsec, setTsec] = useState(0);
  const [trun, setTrun] = useState(false);
  const [tdone, setTdone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(1);
  const ivl = useRef<any>(null);

  useEffect(() => {
    const d = localStorage.getItem("youos_execute");
    if (d) setData(JSON.parse(d));
    else router.push("/");
    setStreak(parseInt(localStorage.getItem("youos_streak") || "1"));
  }, []);

  useEffect(() => {
    if (trun) {
      ivl.current = setInterval(() => {
        setTsec(s => {
          if (s >= 5400) { clearInterval(ivl.current); setTrun(false); setTdone(true); return 5400; }
          return s + 1;
        });
      }, 1000);
    } else clearInterval(ivl.current);
    return () => clearInterval(ivl.current);
  }, [trun]);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const pct = (tsec / 5400) * 100;

  const submitProof = async () => {
    if (!tdone || proof.trim().length < 20) return;
    setLoading(true);
    try {
      const evalRes = await fetch("/api/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: data?.today_task, expected_output: data?.proof_required, proof }),
      });
      const evalData = await evalRes.json();

      const goal = localStorage.getItem("youos_goal") || "";
      const done = localStorage.getItem("youos_done") || "";
      const pillar = localStorage.getItem("youos_pillar") || "growth";

      const nextRes = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, done, pillar, proofContext: { previous_task: data?.today_task, proof, evaluation: JSON.stringify(evalData) } }),
      });
      const nextData = await nextRes.json();

      const prevScores = JSON.parse(localStorage.getItem("youos_scores") || "[]");
      localStorage.setItem("youos_scores", JSON.stringify([...prevScores, evalData.score]));
      localStorage.setItem("youos_execute", JSON.stringify(nextData));
      localStorage.setItem("youos_streak", String(streak + 1));
      localStorage.setItem("youos_last_proof", proof);
      localStorage.setItem("youos_last_eval", JSON.stringify(evalData));

      router.push("/success");
    } catch {
      setLoading(false);
    }
  };

  const tabStyle = (active: boolean, locked = false) => ({
    flex: 1, padding: "10px", border: "none",
    background: active ? "#E85A1A" : "#111",
    color: active ? "#fff" : locked ? "#222" : "#444",
    fontFamily: "'DM Mono',monospace", fontSize: "9px",
    letterSpacing: "2px", textTransform: "uppercase" as const,
    cursor: locked ? "not-allowed" : "pointer",
    borderRadius: "4px", transition: "all .2s",
  });

  const lbl = (color: string, text: string) => (
    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", letterSpacing:"4px", color, textTransform:"uppercase", marginBottom:"8px" }}>{text}</div>
  );

  if (!data) return (
    <main style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"#333", fontFamily:"'DM Mono',monospace", fontSize:"11px", letterSpacing:"3px" }}>LOADING...</p>
    </main>
  );

  return (
    <main style={{ minHeight:"100vh", display:"flex", flexDirection:"column", padding:"16px", gap:"14px" }}>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:"12px", borderBottom:"1px solid #111" }}>
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", letterSpacing:"4px", color:"#E85A1A" }}>DAY {streak} · 90 MIN</div>
          <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:"28px", letterSpacing:"2px", marginTop:"2px" }}>
            EXECUTE <span style={{ color:"#E85A1A" }}>NOW.</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:"34px", color:"#E85A1A", lineHeight:1 }}>{streak}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", color:"#333", letterSpacing:"2px" }}>🔥 STREAK</div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"6px" }}>
        <button onClick={() => setView("plan")} style={tabStyle(view==="plan")}>Plan</button>
        <button onClick={() => setView("timer")} style={tabStyle(view==="timer")}>Timer</button>
        <button onClick={() => { if (tdone) setView("proof"); }} style={tabStyle(view==="proof", !tdone)}>
          Proof {!tdone ? "🔒" : ""}
        </button>
      </div>

      {view==="plan" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"12px", overflowY:"auto", paddingBottom:"20px" }}>

          <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderLeft:"3px solid #E85A1A", borderRadius:"6px", padding:"16px" }}>
            {lbl("#E85A1A", "Goal · 7 Tage")}
            <p style={{ fontSize:"15px", fontWeight:500, lineHeight:1.7, color:"#F0EDE8" }}>{data.goal}</p>
          </div>

          <div style={{ background:"#0a0505", border:"1px solid #1a1a1a", borderLeft:"3px solid #EF4444", borderRadius:"6px", padding:"16px" }}>
            {lbl("#EF4444", "Reality")}
            <p style={{ fontSize:"14px", fontWeight:300, lineHeight:1.7, color:"#EF9090" }}>{data.reality}</p>
          </div>

          <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderLeft:"3px solid #C9A84C", borderRadius:"6px", padding:"16px" }}>
            {lbl("#C9A84C", "Today · 90 Minuten")}
            <p style={{ fontSize:"14px", fontWeight:400, lineHeight:1.8, color:"#F0EDE8", marginBottom: data.today_script ? "12px" : "0" }}>
              {data.today_task}
            </p>
            {data.today_script && (
              <div style={{ background:"#111", borderRadius:"4px", padding:"12px", marginTop:"8px" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", letterSpacing:"3px", color:"#555", marginBottom:"6px" }}>SCRIPT</div>
                <p style={{ fontSize:"13px", fontStyle:"italic", color:"#888", lineHeight:1.7 }}>{data.today_script}</p>
              </div>
            )}
          </div>

          <div style={{ background:"#080808", border:"1px solid #2a2a2a", borderRadius:"6px", padding:"16px" }}>
            {lbl("#555", "Proof Required")}
            <p style={{ fontSize:"14px", fontWeight:300, lineHeight:1.7, color:"#888" }}>{data.proof_required}</p>
            <div style={{ marginTop:"8px", display:"inline-block", background:"#111", padding:"4px 10px", borderRadius:"20px", fontFamily:"'DM Mono',monospace", fontSize:"9px", color:"#555", letterSpacing:"2px" }}>
              FORMAT: {data.proof_format?.toUpperCase()}
            </div>
            <p style={{ marginTop:"10px", fontFamily:"'DM Mono',monospace", fontSize:"10px", color:"#3d2008", letterSpacing:"2px" }}>
              OHNE DIESEN NACHWEIS → KEIN NÄCHSTER SCHRITT
            </p>
          </div>

          <button onClick={() => setView("timer")} style={{ background:"#E85A1A", border:"none", borderRadius:"6px", padding:"16px", color:"#fff", fontFamily:"'Oswald',sans-serif", fontSize:"18px", letterSpacing:"4px", cursor:"pointer", width:"100%" }}>
            TIMER STARTEN →
          </button>
        </div>
      )}

      {view==="timer" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"14px", textAlign:"center" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", letterSpacing:"3px", color:"#333" }}>DAY {streak} · 90 MINUTEN</div>
          <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:"82px", letterSpacing:"4px", lineHeight:1, color:tdone?"#22C55E":trun?"#E85A1A":"#F0EDE8", transition:"color .3s" }}>
            {fmt(tdone ? 5400 : tsec)}
          </div>
          <div style={{ height:"3px", background:"#111", borderRadius:"2px", overflow:"hidden", width:"100%" }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg,#E85A1A,#C9A84C)", width:`${pct}%`, transition:"width 1s linear" }}/>
          </div>
          {!tdone && (
            <button onClick={() => setTrun(r => !r)} style={{ background:trun?"transparent":"#E85A1A", border:trun?"1px solid #E85A1A":"none", borderRadius:"6px", padding:"16px", width:"100%", color:trun?"#E85A1A":"#fff", fontFamily:"'Oswald',sans-serif", fontSize:"18px", letterSpacing:"4px", cursor:"pointer" }}>
              {trun ? "⏸ PAUSE" : tsec===0 ? "▶ START 90 MIN" : "▶ CONTINUE"}
            </button>
          )}
          {tdone && (
            <button onClick={() => setView("proof")} style={{ background:"#22C55E", border:"none", borderRadius:"6px", padding:"16px", color:"#000", fontFamily:"'Oswald',sans-serif", fontSize:"18px", letterSpacing:"4px", cursor:"pointer", width:"100%" }}>
              ✓ DONE → PROVE IT
            </button>
          )}
          {trun && (
            <button onClick={() => setView("plan")} style={{ background:"transparent", border:"1px solid #1e1e1e", borderRadius:"6px", padding:"13px", color:"#555", fontFamily:"'DM Mono',monospace", fontSize:"10px", letterSpacing:"3px", cursor:"pointer", width:"100%" }}>
              ← PLAN
            </button>
          )}
          {!tdone && (
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", color:"#222", letterSpacing:"2px" }}>PROOF UNLOCKS AFTER 90 MIN</p>
          )}
        </div>
      )}

      {view==="proof" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"14px", overflowY:"auto", paddingBottom:"20px" }}>
          <div>
            <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:"38px", lineHeight:.95, letterSpacing:"2px" }}>
              PROVE <span style={{ color:"#E85A1A" }}>IT.</span>
            </div>
            <p style={{ marginTop:"10px", fontSize:"14px", fontWeight:300, color:"#666", lineHeight:1.8 }}>{data.proof_required}</p>
          </div>
          <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:"6px", padding:"14px" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", letterSpacing:"4px", color:"#E85A1A", marginBottom:"8px" }}>WAS HAST DU ERREICHT?</div>
            <textarea
              value={proof}
              onChange={e => setProof(e.target.value)}
              placeholder="Konkret. Zahlen. Namen. Ergebnisse."
              style={{ width:"100%", background:"#111", border:"1px solid #1e1e1e", borderRadius:"5px", padding:"14px", color:"#F0EDE8", fontFamily:"'DM Sans',sans-serif", fontSize:"15px", fontWeight:300, resize:"none", outline:"none", lineHeight:1.8, minHeight:"120px" }}
            />
          </div>
          <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:"6px", padding:"14px" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", letterSpacing:"4px", color:"#555", marginBottom:"8px" }}>NACHWEIS ({data.proof_format?.toUpperCase()})</div>
            <input
              type="text"
              value={proofFile}
              onChange={e => setProofFile(e.target.value)}
              placeholder="Link, Nummer, Name, Screenshot-Beschreibung..."
              style={{ width:"100%", background:"#111", border:"1px solid #1e1e1e", borderRadius:"5px", padding:"12px 14px", color:"#F0EDE8", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", outline:"none" }}
            />
          </div>
          <button
            onClick={submitProof}
            disabled={!tdone || proof.trim().length < 20 || loading}
            style={{ background:!tdone||proof.trim().length<20||loading?"#111":"#22C55E", border:"none", borderRadius:"6px", padding:"16px", color:!tdone||proof.trim().length<20||loading?"#444":"#000", fontFamily:"'Oswald',sans-serif", fontSize:"18px", letterSpacing:"4px", cursor:!tdone||proof.trim().length<20||loading?"not-allowed":"pointer", width:"100%", marginBottom:"24px", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}
          >
            {loading ? (
              <>
                <div style={{ width:"16px", height:"16px", border:"2px solid rgba(0,0,0,.2)", borderTopColor:"#000", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                KI ANALYSIERT...
              </>
            ) : "PROOF EINREICHEN ✓"}
          </button>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  );
}
