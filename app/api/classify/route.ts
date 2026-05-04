import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { goal } = await req.json();

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.OPENROUTER_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: \`Classify the user goal into exactly one pillar. Respond ONLY with one word.

growth = business, startup, money, career, income, freelance, self-employment, finance, investing, learning skills, Firma, Unternehmen, Geld, Karriere, Agentur
health = fitness, weight loss, nutrition, sleep, sport, exercise, body, energy, stress, mental health, Gesundheit, Abnehmen, Sport, Ernährung
relationships = partner, family, friends, network, communication, social, love, connection, Beziehung, Familie, Freunde, Netzwerk

One word only: growth, health, or relationships\`
          },
          { role: "user", content: goal }
        ],
      }),
    });

    const data = await res.json();

    const raw = data.choices?.[0]?.message?.content?.trim().toLowerCase() || "growth";
    const valid = ["growth", "health", "relationships"];
    const pillar = valid.includes(raw) ? raw : "growth";

    return NextResponse.json({ pillar });
  } catch {
    return NextResponse.json({ pillar: "growth" });
  }
}
