import OpenAI from "openai";
import type { Crisis } from "../data/crises";

export interface DailyBriefOutput {
  headline: string;
  summary: string;
  topCrises: Crisis[];
}

export interface ActionSuggestion {
  crisisId: string;
  action: string;
  rationale: string;
}

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT =
  "You are an intelligence analyst writing urgent global health crisis briefs. Write exactly 3 sentences. Sentence 1: the most critical situation and scale of impact. Sentence 2: why it is underreported. Sentence 3: one concrete action anyone can take today. Be specific, direct, and urgent. Never start a sentence with a number.";

export async function generateDailyBrief(crises: Crisis[]): Promise<DailyBriefOutput> {
  const topCrises = crises.slice(0, 3);

  const crisisContext = crises
    .map(
      (c, i) =>
        `${i + 1}. ${c.title} in ${c.country} — urgency ${c.urgencyScore}/10, media coverage ${c.mediaCoverageScore}/10. ${c.description}`
    )
    .join("\n");

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Active crises:\n${crisisContext}` },
    ],
    max_tokens: 350,
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content ?? '';

  // Split only on '. ' followed by a capital letter (real sentence boundary)
  const sentenceMatch = text.match(/^(.+?\.)\s+([A-Z].+)$/s);
  const headline = sentenceMatch ? sentenceMatch[1] : text;
  const summary = sentenceMatch ? sentenceMatch[2] : '';

  return { headline, summary, topCrises };
}

export async function suggestActions(crisis: Crisis): Promise<ActionSuggestion[]> {
  return crisis.neededSkills.map((skill) => ({
    crisisId: crisis.id,
    action: `Deploy ${skill} specialist to ${crisis.country}`,
    rationale: `${skill} identified as a critical gap for ${crisis.title}`,
  }));
}
