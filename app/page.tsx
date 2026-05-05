"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [done, setDone] = useState("");
  const [loading, setLoading] = useState(false);

  const start = async () => {
    if (!goal.trim() || loading) return;
    setLoading(true);
    try {
      const classifyRes = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const { pillar } = await classifyRes.json();

      const executeRes = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, done, pillar }),
      });
      const data = await executeRes.json();

      localStorage.setItem("youos_goal", goal);
      localStorage.setItem("youos_done", done);
      localStorage.setItem("youos_pillar", pillar);
      localStorage.setItem("youos_execute", JSON.stringify(data));
      localStorage.setItem("youos_streak", "1");

      router.push("/execute");
    } catch {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight:"100vh",
      display:"flex",
      flexDirection:"column",
      padding:"32px 20px",
      gap:"28px",
      background:"#000"
    }}>

      {/* LOGO - oben zentriert */}
      <div style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        paddingTop:"8px"
      }}>
        <Image
          src="/youos-logo.png"
          alt="YOUos"
          width={200}
          height={200}
          priority
          style={{ objectFit:"contain" }}
        />
      </div>

      {/* CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"24px"}}>

        <h1 style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(42px,9vw,58px)",
          lineHeight:.95,
          letterSpacing:"2px",
          textAlign:"center"
        }}>
          DO WHAT<br/>YOU SAID<br/>TO <span style={{color:"#E85A1A"}}>YOURSELF.</span>
        </h1>

        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>

          <div>
            <div style={{
              fontFamily:"'DM Mono',monospace",fontSize:"10px",
              letterSpacing:"4px",color:"#E85A1A",marginBottom:"10px"
            }}>
              01 · DEIN ZIEL
            </div>
            <textarea
              value={goal}
              onChange={e=>setGoal(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),start())}
              placeholder="Ich möchte eine KI-Agentur eröffnen..."
              rows={3}
              style={{
                width:"100%",background:"#0d0d0d",
                border:"1px solid #1a1a1a",borderRadius:"6px",
                padding:"16px",color:"#F0EDE8",
                fontFamily:"'DM Sans',sans-serif",fontSize:"15px",
                fontWeight:300,resize:"none",outline:"none",lineHeight:1.8
              }}
              onFocus={e=>e.target.style.borderColor="#E85A1A"}
              onBlur={e=>e.target.style.borderColor="#1a1a1a"}
            />
          </div>

          <div>
            <div style={{
              fontFamily:"'DM Mono',monospace",fontSize:"10px",
              letterSpacing:"4px",color:"#555",marginBottom:"10px"
            }}>
              02 · WAS HAST DU BISHER GETAN?
            </div>
            <textarea
              value={done}
              onChange={e=>setDone(e.target.value)}
              placeholder="Noch nichts / Ich habe bereits..."
              rows={2}
              style={{
                width:"100%",background:"#0d0d0d",
                border:"1px solid #1a1a1a",borderRadius:"6px",
                padding:"16px",color:"#F0EDE8",
                fontFamily:"'DM Sans',sans-serif",fontSize:"15px",
                fontWeight:300,resize:"none",outline:"none",lineHeight:1.8
              }}
              onFocus={e=>e.target.style.borderColor="#E85A1A"}
              onBlur={e=>e.target.style.borderColor="#1a1a1a"}
            />
          </div>

          <button
            onClick={start}
            disabled={!goal.trim()||loading}
            style={{
              background:goal.trim()?"#E85A1A":"#111",
              border:"none",borderRadius:"6px",padding:"17px",
              color:goal.trim()?"#fff":"#444",
              fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",
              letterSpacing:"4px",
              cursor:goal.trim()?"pointer":"not-allowed",
              width:"100%",
              display:"flex",alignItems:"center",
              justifyContent:"center",gap:"10px",
              transition:"all .2s"
            }}
          >
            {loading?(
              <>
                <div style={{
                  width:"16px",height:"16px",
                  border:"2px solid rgba(255,255,255,.2)",
                  borderTopColor:"#fff",borderRadius:"50%",
                  animation:"spin .7s linear infinite"
                }}/>
                ANALYSIERE...
              </>
            ):"START →"}
          </button>
        </div>

        <div style={{
          fontFamily:"'DM Mono',monospace",fontSize:"10px",
          letterSpacing:"2px",color:"#E85A1A",
          padding:"12px 14px",border:"1px solid #3d2008",
          borderRadius:"5px",background:"#0d0604",lineHeight:1.9
        }}>
          ⚠ Kein Prove = Kein nächster Schritt.<br/>
          Der Wert entsteht durch echte Handlung – nicht durch den Plan.
        </div>

      </div>

      <div
        onClick={()=>router.push("/login")}
        style={{
          fontFamily:"'DM Mono',monospace",fontSize:"10px",
          color:"#333",letterSpacing:"2px",
          textAlign:"center",cursor:"pointer",paddingBottom:"8px"
        }}
      >
        ALREADY PROVING? <span style={{color:"#E85A1A"}}>LOGIN →</span>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  );
}
