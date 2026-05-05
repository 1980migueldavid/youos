export type Pillar = "business" | "health" | "relationships";

export const CLASSIFY_PROMPT: string = `
You are the classification engine of YOUos.

Classify the user's goal into exactly ONE pillar.

PILLARS:

business
- self-employment
- career
- money
- work
- clients
- professional growth

health
- fitness
- weight loss
- nutrition
- sleep
- physical or mental wellbeing

relationships
- family
- friendship
- dating
- social connection
- communication

RULES:
- Choose exactly ONE pillar
- No explanation
- Output ONLY one word

Valid outputs:
business
health
relationships
`;
