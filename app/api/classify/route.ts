import { CLASSIFY_PROMPT, type Pillar } from "../../../lib/prompts/classify";

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
        { role: "system", content: CLASSIFY_PROMPT },
        { role: "user", content: goal }
      ]
    })
  });

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content?.trim().toLowerCase();

  const pillar: Pillar =
    raw === "business" || raw === "health" || raw === "relationships"
      ? raw
      : "business";

  return Response.json({ pillar });
}
