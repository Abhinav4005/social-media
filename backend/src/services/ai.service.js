import { fetch } from "undici";
import { AI_PROMPTS, AI_FALLBACKS } from "../constants/aiPrompts.config.js";

class AIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
    }

    async callGemini(prompt) {
        if (!this.apiKey) {
            return null; // Will trigger smart fallback
        }

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!res.ok) {
                console.warn("Gemini API call failed with status:", res.status);
                return null;
            }

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return text || null;
        } catch (err) {
            console.error("Error calling Gemini API:", err);
            return null;
        }
    }

    async generatePostContent({ topic, tone = "engaging" }) {
        const prompt = AI_PROMPTS.POST_GENERATOR(topic, tone);

        const raw = await this.callGemini(prompt);
        if (raw) {
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.title && parsed.description) return parsed;
            } catch (e) {
                // If parsing failed, use fallback below
            }
        }

        return AI_FALLBACKS.POST_GENERATOR(topic);
    }

    async generateListingContent({ item, category, condition = "like new" }) {
        const prompt = AI_PROMPTS.MARKETPLACE_LISTING(item, category, condition);

        const raw = await this.callGemini(prompt);
        if (raw) {
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.title && parsed.description) return parsed;
            } catch (e) {
                // Fallback
            }
        }

        return AI_FALLBACKS.MARKETPLACE_LISTING(item, condition);
    }

    async chatWithAI({ message, history = [] }) {
        const fullPrompt = AI_PROMPTS.CHAT_BOT(message);

        const raw = await this.callGemini(fullPrompt);
        if (raw && raw.trim()) {
            return {
                reply: raw.trim(),
                sender: "AI_BOT",
                timestamp: new Date().toISOString()
            };
        }

        return AI_FALLBACKS.CHAT_BOT(message);
    }

    async summarizePost({ title, description, comments = [] }) {
        const commentText = comments.map((c) => c.content || c).slice(0, 5).join("; ");
        const prompt = AI_PROMPTS.THREAD_SUMMARIZER(title, description, commentText);

        const raw = await this.callGemini(prompt);
        if (raw) {
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.summary) return parsed;
            } catch (e) {
                // Fallback
            }
        }

        return AI_FALLBACKS.THREAD_SUMMARIZER(title, description);
    }

    async generateSmartReply({ context = "", tone = "supportive" }) {
        const prompt = AI_PROMPTS.SMART_REPLY(context, tone);

        const raw = await this.callGemini(prompt);
        if (raw) {
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.replies) return parsed;
            } catch (e) {
                // Fallback
            }
        }

        return AI_FALLBACKS.SMART_REPLY();
    }

    async generateBio({ role, interests }) {
        const prompt = AI_PROMPTS.BIO_GENERATOR(role, interests);
        const raw = await this.callGemini(prompt);
        if (raw) {
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.bios) return parsed;
            } catch (e) { }
        }
        return AI_FALLBACKS.BIO_GENERATOR(role, interests);
    }

    async generateEvent({ title, category }) {
        const prompt = AI_PROMPTS.EVENT_GENERATOR(title, category);
        const raw = await this.callGemini(prompt);
        if (raw) {
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.description) return parsed;
            } catch (e) { }
        }
        return AI_FALLBACKS.EVENT_GENERATOR(title, category);
    }

    async generateGroup({ name, category }) {
        const prompt = AI_PROMPTS.GROUP_GENERATOR(name, category);
        const raw = await this.callGemini(prompt);
        if (raw) {
            try {
                const cleaned = raw.replace(/```json|```/g, "").trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.description) return parsed;
            } catch (e) { }
        }
        return AI_FALLBACKS.GROUP_GENERATOR(name, category);
    }
}

export const defaultAIService = new AIService();
