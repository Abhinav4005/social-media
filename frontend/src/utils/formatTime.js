export function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays <= 7) {
        return date.toLocaleString('en-US', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } else {
        return date.toLocaleString("en-US", {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
    }
}

export function formatLastSeen(timeStamp) {
    if (!timeStamp || isNaN(new Date(timeStamp).getTime())) return "a while ago";

    const date = new Date(timeStamp);
    const now = new Date();
    const diffInMs = now - date;

    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    const formatted = new Intl.DateTimeFormat('en', {
        month: "short",
        year: "numeric"
    }).format(date);
    return formatted;
}