import DOMPurify from "dompurify";

/**
 *
 * @param {string} dirty - Unsanitized user string/HTML
 * @returns {string} Clean HTML string safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(dirty = "") {
    if (typeof dirty !== "string") return "";
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            "b", "i", "em", "strong", "a", "code", "pre",
            "p", "br", "span", "ul", "ol", "li", "blockquote"
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class"],
        ADD_ATTR: ["target"],
    });
}

/**
 *
 * @param {string} text - Raw string
 * @returns {string} Escaped string
 */
export function sanitizeText(text = "") {
    if (typeof text !== "string") return "";
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
