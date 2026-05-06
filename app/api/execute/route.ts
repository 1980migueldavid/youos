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
      model: "openai/gpt-4o-mini",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "execution",
          schema: {
            type: "object",
            properties: {
              goal: { type: "string" },
              reality: { type: "string" },
              today: { type: "string" },
              proof: { type: "string" }
            },
            required: ["goal", "reality", "today", "proof"]
          }
        }
      },
      messages: [
        { role: "system", content: EXECUTE_PROMPT },
        { role: "user", content: goal }
      ]
    })
  });

  const data = await response.json();

  const content =
    data.choices?.[0]?.message?.content;

  try {
    const parsed = typeof content === "string"
      ? JSON.parse(content)
      : content;

    return Response.json(parsed);
  } catch (e) {
    return Response.json({
      goal: "ERROR",
      reality: "Parsing failed",
      today: JSON.stringify(content),
      proof: "Check model response"
    });
  }
}
