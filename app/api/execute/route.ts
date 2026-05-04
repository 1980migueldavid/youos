import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { goal, done = "", pillar = "growth" } = await req.json();

  const systemPrompt = `You are a strict execution coach.

Return JSON with:
- goal
- reality
- today_task
- proof_required`;

  const userMessage = `Goal: ${goal}
Done: ${done}
Pillar: ${pillar}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
        goal: goal,
        reality: "No structured plan yet.",
        today_task: "Write down 3 concrete steps.",
        proof_required: "Screenshot"
      };
    }

    return NextResponse.json(data);

  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
