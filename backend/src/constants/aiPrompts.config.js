/**
 * Centralized AI Prompts & System Configuration
 * All Gemini AI prompt templates, system personas, and fallback responses reside here.
 */

export const AI_SYSTEM_PROMPTS = {
    CHAT_BOT_PERSONA:
        "You are SocialHub AI Assistant, a friendly, intelligent, and helpful AI assistant built directly into Social Hub app. Keep responses helpful, concise, well-formatted, and engaging.",
};

export const AI_PROMPTS = {
    POST_GENERATOR: (topic, tone = "engaging") =>
        `You are a social media AI assistant. Write an engaging social media post about: "${topic}". Tone should be ${tone}. Return JSON format with exact keys "title", "description", and "hashtags" (array of strings). Do not wrap in markdown code blocks if possible.`,

    MARKETPLACE_LISTING: (item, category, condition = "like new") =>
        `You are a marketplace assistant. Write a high-converting product listing for an item named "${item}" in category "${category}" with condition "${condition}". Return JSON format with exact keys "title", "description", and "suggestedPrice". Do not wrap in markdown code blocks.`,

    CHAT_BOT: (message) =>
        `${AI_SYSTEM_PROMPTS.CHAT_BOT_PERSONA}\nUser says: "${message}"\nProvide a clear and friendly response.`,

    THREAD_SUMMARIZER: (title, description, commentText = "") =>
        `You are a social media AI summarizer. Summarize the following post and its discussion concisely into 3 bullet points.\nTitle: ${title}\nDescription: ${description}\nComments: ${commentText}\nReturn JSON with key "summary" (array of 3 strings) and "sentiment" ("Positive" | "Neutral" | "Insightful").`,

    SMART_REPLY: (context = "", tone = "supportive") =>
        `You are an AI Smart Reply generator for a social app. Generate 3 short, natural 1-sentence reply options for this post/comment: "${context}". Tone: ${tone}. Return JSON array of strings under key "replies".`,
};

export const AI_FALLBACKS = {
    POST_GENERATOR: (topic) => {
        const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        const mainTopic = (topic || "Community Update").trim();
        return {
            title: `✨ ${capitalize(mainTopic)}: Insights & Reflections`,
            description: `Excited to share some thoughts on ${mainTopic}! It's inspiring to see how fast things are moving in our community. What are your thoughts on this? Let's discuss in the comments below! 👇`,
            hashtags: [
                `#${mainTopic.replace(/\s+/g, "")}`,
                "#SocialHub",
                "#Community",
                "#Discussion",
            ],
        };
    },

    MARKETPLACE_LISTING: (item, condition = "like new") => ({
        title: `${item} (${condition.toUpperCase()})`,
        description: `Selling a well-maintained ${item} in ${condition} condition. Works perfectly with no defects. Ideal for anyone looking for quality at a great price! Cleaned and ready for pickup/delivery.`,
        suggestedPrice: "Contact for price",
    }),

    CHAT_BOT: (message) => {
        const msgLower = (message || "").toLowerCase();
        let fallbackReply =
            "I am SocialHub AI Bot! How can I assist you with posts, marketplace listings, events, or groups today? 😊";

        if (
            msgLower.includes("hello") ||
            msgLower.includes("hi") ||
            msgLower.includes("hey")
        ) {
            fallbackReply =
                "Hello there! 👋 I am your SocialHub AI assistant. I can help you draft posts, generate product listings, or answer any questions you have!";
        } else if (msgLower.includes("post") || msgLower.includes("create")) {
            fallbackReply =
                "To create a post, click on the **'Create Post'** button on your feed or group page! You can also use the ✨ **AI Magic Writer** to generate awesome titles and captions automatically.";
        } else if (
            msgLower.includes("marketplace") ||
            msgLower.includes("sell")
        ) {
            fallbackReply =
                "You can sell items on the **Marketplace** page! Click **'Sell Item'** and use our ✨ **AI Assistant** to write an eye-catching product description.";
        } else if (msgLower.includes("group") || msgLower.includes("event")) {
            fallbackReply =
                "Social Hub supports community groups and events! You can create custom groups, host events, and join discussions anytime.";
        }

        return {
            reply: fallbackReply,
            sender: "AI_BOT",
            timestamp: new Date().toISOString(),
        };
    },

    THREAD_SUMMARIZER: (title, description) => ({
        summary: [
            `📌 Core Discussion: ${title || "Community Post"}`,
            `💡 Key Takeaway: ${description
                ? description.slice(0, 80) + "..."
                : "Engaging discussion among community members."
            }`,
            `💬 Sentiment: High community engagement with active comments.`,
        ],
        sentiment: "Positive",
    }),

    SMART_REPLY: () => ({
        replies: [
            "That's super interesting! Thanks for sharing this breakdown. 🙌",
            "Totally agree with your points here! Great insights. 💡",
            "Awesome update! Looking forward to seeing more. ✨",
        ],
    }),
};
