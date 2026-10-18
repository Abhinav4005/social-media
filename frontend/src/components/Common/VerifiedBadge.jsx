import React from "react";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";

export default function VerifiedBadge({ type = "BLUE_CHECK", className = "w-4 h-4" }) {
    if (type === "CREATOR") {
        return (
            <span title="Verified Content Creator" className="inline-flex items-center text-amber-500 dark:text-amber-400">
                <Star className={`${className} fill-current`} />
            </span>
        );
    }

    if (type === "GOV_ID") {
        return (
            <span title="Official ID Verified" className="inline-flex items-center text-emerald-500 dark:text-emerald-400">
                <ShieldCheck className={`${className} fill-current`} />
            </span>
        );
    }

    return (
        <span title="Verified User" className="inline-flex items-center text-blue-500 dark:text-blue-400">
            <CheckCircle2 className={`${className} fill-current`} />
        </span>
    );
}
