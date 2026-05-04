import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task, expected_output, proof } = await req.json();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You are a strict execution evaluator. Validate real work. Reject vague output. Be direct. Respond in the user's language. Return ONLY valid JSON without backticks.`
        },
        {
          role: "user",
          content: `Task: ${task}
Expected Output: ${expected_output}
User Proof: ${proof}

Return JSON:
{
  "valid": true,
  "score": 8,
  "feedback": {
    "was_gut": "what was good",
    "was_schlecht": "what was bad",
    "fehlt": "what is missing"
  },
  "improvement": "one clear next action",
  "next_task_adjustment": "how to adjust tomorrow"
}`
        }
      ]
    })
  });

  const data = await response.json();
  try {
    const text = data.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ valid: true, score: 5, feedback: { was_gut: "Submitted", was_schlecht: "Needs more detail", fehlt: "Specifics" }, improvement: "Be more specific next time", next_task_adjustment: "Same task with more detail" });
  }
}
