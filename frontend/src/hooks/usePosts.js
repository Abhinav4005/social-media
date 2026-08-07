import { useState, useEffect, useCallback } from "react";
import { postService } from "../services/post.service";

/**
 * Custom Hook: usePosts
 * Encapsulates feed fetching, pagination, post creation, comments, and reactions.
 * Fulfills SRP & ISP.
 */
export function usePosts(initialPage = 1, limit = 10) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeed = useCallback(async (pageNum = page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await postService.getPostFeed(pageNum, limit);
            if (pageNum === 1) {
                setPosts(data.posts || []);
            } else {
                setPosts((prev) => [...prev, ...(data.posts || [])]);
            }
            setHasMore(data.hasMore);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            const message = err.response?.data?.error || err.message || "Failed to fetch post feed";
            setError(message);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchFeed(1);
    }, [fetchFeed]);

    const createPost = useCallback(async (formData) => {
        try {
            const data = await postService.createPost(formData);
            if (data.post) {
                setPosts((prev) => [data.post, ...prev]);
            }
            return data;
        } catch (err) {
            const message = err.response?.data?.error || err.message || "Failed to create post";
            throw new Error(message);
        }
    }, []);

    const reactOnPost = useCallback(async (postId, status) => {
        try {
            const data = await postService.reactOnPost(postId, status);
            setPosts((prev) => prev.map((p) => {
                if (p.id === postId) {
                    return { ...p, reaction: data.reaction, likesCount: data.likeCount };
                }
                return p;
            }));
            return data;
        } catch (err) {
            console.error("Error reacting to post", err);
        }
    }, []);

    const commentOnPost = useCallback(async (postId, content, parentId = null) => {
        try {
            const data = await postService.commentOnPost(postId, content, parentId);
            setPosts((prev) => prev.map((p) => {
                if (p.id === postId) {
                    return { ...p, comments: [...(p.comments || []), data.comment] };
                }
                return p;
            }));
            return data;
        } catch (err) {
            const message = err.response?.data?.error || err.message || "Failed to add comment";
            throw new Error(message);
        }
    }, []);

    return {
        posts,
        loading,
        hasMore,
        error,
        fetchFeed,
        createPost,
        reactOnPost,
        commentOnPost,
        loadMore: () => {
            if (hasMore && !loading) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchFeed(nextPage);
            }
        }
    };
}
