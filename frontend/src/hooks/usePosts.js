import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostFeed, createPost, likePost, commentOnPost, savePost } from "../api/posts.api";
import { QUERY_KEYS } from "../constant/queryKeys";

export function useFeedPosts() {
    const query = useInfiniteQuery({
        queryKey: QUERY_KEYS.feed,
        queryFn: ({ pageParam = 1 }) => getPostFeed(pageParam),
        getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage?.page + 1 : undefined),
    });

    const feedPosts = query.data?.pages?.flatMap((page) => page?.posts || []) || [];

    return {
        ...query,
        posts: feedPosts,
    };
}

export function useCreatePostMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData) => createPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userPosts });
        },
    });
}

export function useLikePostMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId) => likePost(postId),
        onSuccess: (_, postId) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
        }
    });
}

export function useCommentOnPostMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, commentData }) => commentOnPost(postId, commentData),
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
        }
    });
}

export function useSavePostMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId) => savePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.saved });
        }
    });
}
