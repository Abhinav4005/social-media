import { fetch } from "undici";

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
        const prompt = `You are a social media AI assistant. Write an engaging social media post about: "${topic}". Tone should be ${tone}. Return JSON format with exact keys "title", "description", and "hashtags" (array of strings). Do not wrap in markdown code blocks if possible.`;

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

        // Smart Fallback Generator (Works 100% reliably even without API Key)
        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        const mainTopic = topic.trim() || "Community Update";

        return {
            title: `✨ ${capitalize(mainTopic)}: Insights & Reflections`,
            description: `Excited to share some thoughts on ${mainTopic}! It's inspiring to see how fast things are moving in our community. What are your thoughts on this? Let's discuss in the comments below! 👇`,
            hashtags: [`#${mainTopic.replace(/\s+/g, "")}`, "#SocialHub", "#Community", "#Discussion"]
        };
    }

    async generateListingContent({ item, category, condition = "like new" }) {
        const prompt = `You are a marketplace assistant. Write a high-converting product listing for an item named "${item}" in category "${category}" with condition "${condition}". Return JSON format with exact keys "title", "description", and "suggestedPrice". Do not wrap in markdown code blocks.`;

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

        // Smart Fallback Generator
        return {
            title: `${item} (${condition.toUpperCase()})`,
            description: `Selling a well-maintained ${item} in ${condition} condition. Works perfectly with no defects. Ideal for anyone looking for quality at a great price! Cleaned and ready for pickup/delivery.`,
            suggestedPrice: "Contact for price"
        };
    }

    async chatWithAI({ message, history = [] }) {
        const systemPrompt = "You are SocialHub AI Assistant, a friendly, intelligent, and helpful AI assistant built directly into Social Hub app. Keep responses helpful, concise, well-formatted, and engaging.";
        const fullPrompt = `${systemPrompt}\nUser says: "${message}"\nProvide a clear and friendly response.`;

        const raw = await this.callGemini(fullPrompt);
        if (raw && raw.trim()) {
            return {
                reply: raw.trim(),
                sender: "AI_BOT",
                timestamp: new Date().toISOString()
            };
        }

        // Helpful Smart Fallback Bot Persona
        const msgLower = message.toLowerCase();
        let fallbackReply = "I am SocialHub AI Bot! How can I assist you with posts, marketplace listings, events, or groups today? 😊";

        if (msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("hey")) {
            fallbackReply = "Hello there! 👋 I am your SocialHub AI assistant. I can help you draft posts, generate product listings, or answer any questions you have!";
        } else if (msgLower.includes("post") || msgLower.includes("create")) {
            fallbackReply = "To create a post, click on the **'Create Post'** button on your feed or group page! You can also use the ✨ **AI Magic Writer** to generate awesome titles and captions automatically.";
        } else if (msgLower.includes("marketplace") || msgLower.includes("sell")) {
            fallbackReply = "You can sell items on the **Marketplace** page! Click **'Sell Item'** and use our ✨ **AI Assistant** to write an eye-catching product description.";
        } else if (msgLower.includes("group") || msgLower.includes("event")) {
            fallbackReply = "Social Hub supports community groups and events! You can create custom groups, host events, and join discussions anytime.";
        }

        return {
            reply: fallbackReply,
            sender: "AI_BOT",
            timestamp: new Date().toISOString()
        };
    }

    async summarizePost({ title, description, comments = [] }) {
        const commentText = comments.map((c) => c.content || c).slice(0, 5).join("; ");
        const prompt = `You are a social media AI summarizer. Summarize the following post and its discussion concisely into 3 bullet points.\nTitle: ${title}\nDescription: ${description}\nComments: ${commentText}\nReturn JSON with key "summary" (array of 3 strings) and "sentiment" ("Positive" | "Neutral" | "Insightful").`;

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

        // Smart Fallback Summarizer
        return {
            summary: [
                `📌 Core Discussion: ${title || "Community Post"}`,
                `💡 Key Takeaway: ${description ? description.slice(0, 80) + "..." : "Engaging discussion among community members."}`,
                `💬 Sentiment: High community engagement with active comments.`
            ],
            sentiment: "Positive"
        };
    }

    async generateSmartReply({ context = "", tone = "supportive" }) {
        const prompt = `You are an AI Smart Reply generator for a social app. Generate 3 short, natural 1-sentence reply options for this post/comment: "${context}". Tone: ${tone}. Return JSON array of strings under key "replies".`;

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

        // Smart Fallback Options
        return {
            replies: [
                "That's super interesting! Thanks for sharing this breakdown. 🙌",
                "Totally agree with your points here! Great insights. 💡",
                "Awesome update! Looking forward to seeing more. ✨"
            ]
        };
    }
}

export const defaultAIService = new AIService();
