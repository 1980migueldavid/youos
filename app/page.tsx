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
    <main style={{ padding: 20 }}>
      <h1>YOUos</h1>

      <textarea
        placeholder="Dein Ziel..."
        value={goal}
        onChange={e => setGoal(e.target.value)}
      />

      <textarea
        placeholder="Was hast du getan?"
        value={done}
        onChange={e => setDone(e.target.value)}
      />

      <button onClick={start}>
        START
      </button>
    </main>
  );
}
