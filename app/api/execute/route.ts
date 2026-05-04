import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { goal, done = "", pillar = "growth", userId = "anon", proofContext = null } = await req.json();

  const isFirstTime = !proofContext;

  const systemPrompt = \`You are a brutal execution coach. No motivation. No plans. Only action.

CONTEXT INTERPRETATION - CRITICAL:
The user answered TWO specific questions:
1. "What is your goal?"
2. "What have you done SO FAR to achieve this goal?"

If answer to question 2 is "nothing", "noch nichts", "nada":
→ starting from zero

BLOCK 1 – GOAL:
One sentence measurable outcome for 7 days.

BLOCK 2 – REALITY:
2 sentences MAX based ONLY on goal + done.

BLOCK 3 – TODAY:
One 90 min task with exact steps.

BLOCK 4 – PROOF:
Exact output required.

Return ONLY JSON.\`;

  const userMessage = proofContext
    ? \`Goal: "\${goal}"
Done: "\${done}"
Previous task: \${proofContext.previous_task}
Proof: \${proofContext.proof}
Evaluation: \${proofContext.evaluation}\`
    : \`Goal: "\${goal}"
Done: "\${done}"
Pillar: \${pillar}\`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.OPENROUTER_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-5",
        temperature: 0.3,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content || "";

    let data;

    try {
      data = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      data = {
        goal: \`Ersten Fortschritt bei "\${goal}" in 7 Tagen.\`,
        reality: "Du hast ein Ziel, aber noch keine echte Umsetzung.",
        today_task: "Schreibe 5 konkrete Schritte auf.",
        today_script: null,
        proof_required: "Screenshot deiner Notizen",
        proof_format: "screenshot",
        pillar,
      };
    }

    try {
      await supabase.from("plans").insert({
        user_id: userId,
        pillar,
        goal,
        next_action: data.today_task,
      });
    } catch {}

    return NextResponse.json({ ...data, iteration: isFirstTime ? 1 : 2 });

  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
