import { EXECUTE_PROMPT } from "../../../lib/prompts/execute";

export async function POST(req: Request) {
  const { goal } = await req.json();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: EXECUTE_PROMPT },
        { role: "user", content: goal }
      ]
    })
  });

  const data = await response.json();

  const raw: string =
    data.choices?.[0]?.message?.content ||
    data.choices?.[0]?.text ||
    "";

  // 🔥 JSON extrahieren, selbst wenn Modell Müll drumherum schreibt
  const match = raw.match(/\{[\s\S]*\}/);

  try {
    const parsed = JSON.parse(match ? match[0] : raw);

    return Response.json({
      goal: parsed.goal || "",
      reality: parsed.reality || "",
      today: parsed.today || "",
      proof: parsed.proof || ""
    });
  } catch (e) {
    return Response.json({
      goal: "ERROR",
      reality: "Model did not return valid JSON",
      today: raw,
      proof: "Fix prompt / model output"
    });
  }
}
