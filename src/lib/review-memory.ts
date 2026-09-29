import { prisma } from "./prisma";

// ─── PHRASE NORMALIZATION ───────────────────────────────────────────────────

export function normalizeText(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s\u0C00-\u0C7F]/g, " ") // keep English + Telugu letters and digits
    .replace(/\s+/g, " ")
    .trim();
}

export function extractOpeningPhrase(text: string, wordCount = 4, businessName?: string): string {
  let cleaned = normalizeText(text);
  if (businessName) {
    const bizNorm = normalizeText(businessName);
    if (cleaned.startsWith(bizNorm)) {
      cleaned = cleaned.substring(bizNorm.length).trim();
    }
  }
  const words = cleaned.split(" ").filter(Boolean);
  return words.slice(0, wordCount).join(" ");
}

export function extractClosingPhrase(text: string, wordCount = 4): string {
  const words = normalizeText(text).split(" ").filter(Boolean);
  return words.slice(-wordCount).join(" ");
}

export function tokenizeWords(text: string): Set<string> {
  const words = normalizeText(text).split(" ").filter((w) => w.length > 1);
  const tokenSet = new Set<string>(words);

  // Add word bigrams for phrase overlap detection
  for (let i = 0; i < words.length - 1; i++) {
    tokenSet.add(`${words[i]}_${words[i + 1]}`);
  }

  return tokenSet;
}

// ─── SIMILARITY METRICS ─────────────────────────────────────────────────────

export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const setA = tokenizeWords(textA);
  const setB = tokenizeWords(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersection++;
  });

  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

export function hasLongCommonSubstring(
  textA: string,
  textB: string,
  minLength = 40,
  businessName?: string
): boolean {
  let normA = normalizeText(textA);
  let normB = normalizeText(textB);

  // Mask out business name so shared business name doesn't cause false positive matches
  if (businessName) {
    const bizNorm = normalizeText(businessName);
    if (bizNorm.length > 3) {
      normA = normA.split(bizNorm).join(" ");
      normB = normB.split(bizNorm).join(" ");
    }
  }

  normA = normA.replace(/\s+/g, " ").trim();
  normB = normB.replace(/\s+/g, " ").trim();

  if (normA.length < minLength || normB.length < minLength) return false;

  for (let i = 0; i <= normA.length - minLength; i += 5) {
    const chunk = normA.substring(i, i + minLength);
    if (normB.includes(chunk)) {
      return true;
    }
  }

  return false;
}

// ─── BANNED REPETITIVE CLICHÉS ──────────────────────────────────────────────
// Patterns that must NEVER become recurring templates
const BANNED_REPETITIVE_PATTERNS = [
  /had a wonderful experience with/i,
  /made our memories truly special/i,
  /highly recommended studio and gift center/i,
  /5-star rating for/i,
  /finding a consultant with such high/i,
  /will always consult them/i,
  /cannot say enough good things about/i,
  /is pure perfection/i,
  /best studio in town/i,
  /5 stars all the way/i,
  /a game changer/i,
  /epitome of/i,
  /testament to/i,
  /transcends expectations/i,
];

export function containsBannedCliché(text: string): { found: boolean; pattern?: string } {
  for (const pattern of BANNED_REPETITIVE_PATTERNS) {
    if (pattern.test(text)) {
      return { found: true, pattern: pattern.source };
    }
  }
  return { found: false };
}

// ─── REVIEW MEMORY VALIDATION INTERFACE ─────────────────────────────────────

export interface MemoryReviewItem {
  id?: string;
  reviewText: string;
  openingPhrase: string;
  closingPhrase: string;
  structureTag?: string;
  languageMix?: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  overlapScore?: number;
}

/**
 * Validates a candidate review against stored memory and recent reviews.
 * Rejects if:
 * 1. Contains banned cliché templates
 * 2. Exact match with ANY review in history or batch
 * 3. Identical opening phrase (first 4 words) with sibling or recent history
 * 4. Identical closing phrase (last 4 words) with sibling or recent history
 * 5. Jaccard similarity > 0.40 against siblings or > 0.45 against history
 * 6. Common continuous phrase >= 30 characters (excluding business name)
 */
export function validateReviewUniqueness(
  candidate: string,
  history: MemoryReviewItem[],
  previouslyAcceptedCandidates: string[] = [],
  businessName?: string
): ValidationResult {
  const trimmed = candidate.trim();

  if (trimmed.length < 15) {
    return { valid: false, reason: "Review text too short." };
  }

  // 1. Cliché check
  const cliché = containsBannedCliché(trimmed);
  if (cliché.found) {
    return { valid: false, reason: `Contains banned recurring pattern: ${cliché.pattern}` };
  }

  const candidateOpening = extractOpeningPhrase(trimmed, 4, businessName);
  const candidateClosing = extractClosingPhrase(trimmed, 4);
  const candidateNorm = normalizeText(trimmed);

  // 2. Check against currently generating sibling candidates in the same batch (strict)
  for (const sibling of previouslyAcceptedCandidates) {
    const siblingNorm = normalizeText(sibling);
    if (candidateNorm === siblingNorm) {
      return { valid: false, reason: "Identical to sibling review in current batch." };
    }
    const siblingOpening = extractOpeningPhrase(sibling, 4, businessName);
    if (candidateOpening && siblingOpening && candidateOpening === siblingOpening) {
      return { valid: false, reason: `Same opening as sibling review: "${candidateOpening}"` };
    }
    const siblingClosing = extractClosingPhrase(sibling, 4);
    if (candidateClosing && siblingClosing && candidateClosing === siblingClosing) {
      return { valid: false, reason: `Same closing as sibling review: "${candidateClosing}"` };
    }
    const siblingSim = calculateJaccardSimilarity(trimmed, sibling);
    if (siblingSim > 0.38) {
      return {
        valid: false,
        reason: `High similarity with sibling review (${Math.round(siblingSim * 100)}% overlap).`,
        overlapScore: siblingSim,
      };
    }
    if (hasLongCommonSubstring(trimmed, sibling, 28, businessName)) {
      return { valid: false, reason: "Shares a continuous phrase with sibling review." };
    }
  }

  // 3. Check against historical memory
  // Check exact duplicate across ALL history items
  for (const item of history) {
    if (candidateNorm === normalizeText(item.reviewText)) {
      return { valid: false, reason: "Exact match with a previously generated review." };
    }
  }

  // Check recent history window (last 50 reviews for phrase/opening/substring collisions)
  const recentHistory = history.slice(0, 50);
  for (const item of recentHistory) {
    // Opening phrase collision
    if (candidateOpening && item.openingPhrase) {
      const itemOpening = extractOpeningPhrase(item.reviewText, 4, businessName);
      if (candidateOpening === itemOpening) {
        return { valid: false, reason: `Identical opening phrase to recent review: "${candidateOpening}"` };
      }
    }

    // Closing phrase collision
    if (candidateClosing && item.closingPhrase && candidateClosing === item.closingPhrase) {
      return { valid: false, reason: `Identical closing phrase to recent review: "${candidateClosing}"` };
    }

    // Common substring overlap (excluding business name)
    if (hasLongCommonSubstring(trimmed, item.reviewText, 38, businessName)) {
      return { valid: false, reason: "Shares a continuous sentence chunk with a recent review." };
    }

    // Jaccard similarity threshold
    const sim = calculateJaccardSimilarity(trimmed, item.reviewText);
    if (sim > 0.42) {
      return {
        valid: false,
        reason: `Too similar to existing review (${Math.round(sim * 100)}% overlap).`,
        overlapScore: sim,
      };
    }
  }

  return { valid: true };
}

// ─── DATABASE FETCH & PERSISTENCE ──────────────────────────────────────────

/**
 * Loads recent review history for a specific business plus platform-wide recent reviews.
 */
export async function fetchRecentReviewHistory(
  businessId?: string,
  limit = 60
): Promise<MemoryReviewItem[]> {
  try {
    const items = await prisma.generatedReviewMemory.findMany({
      where: businessId
        ? {
            OR: [{ businessId }, { businessId: null }],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        reviewText: true,
        openingPhrase: true,
        closingPhrase: true,
        structureTag: true,
        languageMix: true,
      },
    });

    return items;
  } catch (error) {
    console.warn("fetchRecentReviewHistory warning:", error);
    return [];
  }
}

export interface ReviewRecordPayload {
  text: string;
  structureTag?: string;
  writingStyle?: string;
  languageMix?: string;
  tagsUsed?: string;
}

/**
 * Persists accepted unique reviews to the GeneratedReviewMemory table.
 */
export async function recordGeneratedReviews(
  reviews: ReviewRecordPayload[],
  businessId?: string,
  businessName = "Store",
  category = "Local Business"
): Promise<void> {
  if (!reviews || reviews.length === 0) return;

  try {
    const records = reviews.map((r) => ({
      businessId: businessId || null,
      businessName,
      category,
      reviewText: r.text.trim(),
      openingPhrase: extractOpeningPhrase(r.text, 4),
      closingPhrase: extractClosingPhrase(r.text, 4),
      structureTag: r.structureTag || "STRUCTURE_A",
      writingStyle: r.writingStyle || "conversational",
      languageMix: r.languageMix || "ENGLISH",
      tagsUsed: r.tagsUsed || null,
      ngramHash: Array.from(tokenizeWords(r.text)).slice(0, 15).join("|"),
    }));

    await prisma.generatedReviewMemory.createMany({
      data: records,
      skipDuplicates: true,
    });
  } catch (error) {
    console.warn("recordGeneratedReviews warning:", error);
  }
}
