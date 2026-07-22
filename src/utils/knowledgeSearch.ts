import { KbArticle } from "@/src/data/knowledgeBase";
import { KnowledgeBaseCourse } from "@/src/services/website/knowledgeBase";

/**
 * Dependency-free knowledge retrieval for the support widget.
 *
 * This is deliberately "matching, not understanding": it tokenizes the query and scores
 * it against a fixed corpus (curated articles + live course data). It's the seam a future
 * AI layer would sit behind — swap this scorer for an embedding/RAG retriever and the
 * widget UI stays the same.
 */

const STOPWORDS = new Set([
    "a", "an", "the", "is", "are", "am", "do", "does", "did", "i", "how", "can", "could",
    "to", "of", "for", "my", "me", "you", "your", "what", "which", "and", "or", "in", "on",
    "with", "get", "got", "will", "be", "it", "this", "that", "please", "need", "want",
    "about", "any", "some", "there", "have", "has", "was", "were", "would", "should", "at",
    "by", "from", "as", "if", "so", "we", "us", "our",
]);

const normalize = (text: string): string =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const singular = (token: string): string =>
    token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;

export const tokenize = (text: string): string[] => {
    const tokens = normalize(text)
        .split(" ")
        .filter((t) => t.length > 1 && !STOPWORDS.has(t))
        .map(singular);
    return Array.from(new Set(tokens));
};

interface Scored<T> {
    item: T;
    score: number;
}

const scoreTokens = (
    queryTokens: string[],
    strongText: string, // title / question / keywords — matches weigh more
    weakText: string, // body / description — matches weigh less
): number => {
    if (queryTokens.length === 0) return 0;

    const strong = normalize(strongText);
    const weak = normalize(weakText);
    const strongTokens = new Set(strong.split(" ").map(singular));
    const weakTokens = new Set(weak.split(" ").map(singular));

    let score = 0;
    let matched = 0;

    for (const qt of queryTokens) {
        if (strongTokens.has(qt)) {
            score += 3;
            matched++;
        } else if (strong.includes(qt)) {
            score += 2;
            matched++;
        } else if (weakTokens.has(qt)) {
            score += 1.5;
            matched++;
        } else if (weak.includes(qt)) {
            score += 1;
            matched++;
        }
    }

    if (matched === 0) return 0;

    // Reward covering more of the query, and full-phrase hits in the strong field.
    score *= matched / queryTokens.length;
    if (strong.includes(normalize(queryTokens.join(" ")))) score += 2;

    return score;
};

const RECOMMEND_HINTS = [
    "recommend", "suggest", "which course", "what course", "help me choose", "choose a course",
    "best course", "course for me", "good for", "should i take", "advise",
];

export const wantsRecommendation = (query: string): boolean => {
    const q = normalize(query);
    return RECOMMEND_HINTS.some((h) => q.includes(h));
};

export const searchArticles = (query: string, articles: KbArticle[]): KbArticle[] => {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const scored: Scored<KbArticle>[] = articles
        .map((article) => ({
            item: article,
            score: scoreTokens(
                queryTokens,
                `${article.question} ${article.keywords.join(" ")}`,
                article.answer,
            ),
        }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

    return scored.map((s) => s.item);
};

export const searchCourses = (query: string, courses: KnowledgeBaseCourse[]): KnowledgeBaseCourse[] => {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const scored: Scored<KnowledgeBaseCourse>[] = courses
        .map((course) => ({
            item: course,
            score: scoreTokens(
                queryTokens,
                `${course.title} ${course.categoryName ?? ""}`,
                `${course.description ?? ""} ${course.whoIsCourseFor ?? ""}`,
            ),
        }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);

    return scored.map((s) => s.item);
};

export interface KnowledgeSearchResult {
    articles: KbArticle[];
    courses: KnowledgeBaseCourse[];
    recommend: boolean;
    hasResults: boolean;
}

export const searchKnowledge = (
    query: string,
    articles: KbArticle[],
    courses: KnowledgeBaseCourse[],
): KnowledgeSearchResult => {
    const matchedArticles = searchArticles(query, articles).slice(0, 5);
    const matchedCourses = searchCourses(query, courses).slice(0, 5);
    return {
        articles: matchedArticles,
        courses: matchedCourses,
        recommend: wantsRecommendation(query),
        hasResults: matchedArticles.length > 0 || matchedCourses.length > 0,
    };
};
