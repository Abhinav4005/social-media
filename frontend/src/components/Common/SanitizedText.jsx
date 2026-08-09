import { memo } from "react";
import { sanitizeHtml } from "../../utils/sanitize";

/**
 * @param {string} content - Raw user input/HTML to render safely
 * @param {string} className - Optional Tailwind CSS classes
 * @param {string} as - HTML tag wrapper (default "div")
 */
function SanitizedText({ content = "", className = "", as: Component = "div" }) {
    const cleanHtml = sanitizeHtml(content);

    return (
        <Component
            className={className}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
    );
}

export default memo(SanitizedText);
