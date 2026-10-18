import { ModerationService } from "../services/moderation.service.js";

export const contentModerator = (contentType = "POST") => {
    return (req, res, next) => {
        const textToScan = [
            req.body.title,
            req.body.description,
            req.body.content,
            req.body.text
        ].filter(Boolean).join(" ");

        if (!textToScan) {
            return next();
        }

        const userId = req.user ? req.user.id : null;
        const scanResult = ModerationService.scanContent(textToScan, contentType, userId);

        if (scanResult.toxicityScore >= 0.8) {
            return res.status(422).json({
                success: false,
                message: "Your content was blocked as it violates our Community Guidelines regarding hateful, abusive, or dangerous language.",
                flags: scanResult.flags
            });
        }

        req.moderationResult = scanResult;
        next();
    };
};
