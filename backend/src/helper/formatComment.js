export function nestComments(comments) {
    const map = {};
    const roots = [];

    comments.forEach(comment => {
        comment.replies = [];
        map[comment.id] = comment
    });

    comments.forEach(comment => {
        if(comment.parentId) {
            const parent = map[comment.parentId];
            if(parent) {
                parent.replies.push(comment);
            }
        } else {
            roots.push(comment);
        }
    });

    return roots;
}