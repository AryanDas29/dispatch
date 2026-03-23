import type { Crisis } from "../data/crises";

/**
 * Ranks crises by urgencyScore * (1 / mediaCoverageScore) descending.
 * Higher urgency and lower media coverage both increase a crisis's rank,
 * surfacing underreported emergencies alongside acute ones.
 */
export function rankCrises(crises: Crisis[]): Crisis[] {
  return [...crises].sort((a, b) => {
    const scoreA = a.urgencyScore * (1 / a.mediaCoverageScore);
    const scoreB = b.urgencyScore * (1 / b.mediaCoverageScore);
    return scoreB - scoreA;
  });
}
