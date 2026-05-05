import { EXECUTE_PROMPT, buildExecuteInput } from "@/lib/prompts/execute";
import type { Pillar } from "@/lib/prompts/classify";

export async function POST(req: Request) {
  const { goal, pillar } = await req.json() as {
    goal: string;
    pillar: Pillar;
  };

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
        { role: "user", content: buildExecuteInput(pillar, goal) }
      ]
    })
  });

  const data = await response.json();

  return Response.json({
    output: data.choices?.[0]?.message?.content || ""
  });
}
