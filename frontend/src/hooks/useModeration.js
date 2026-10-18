import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderationService } from "../services/moderation.service";
import { QUERY_KEYS } from "../constant/queryKeys";

export function useSubmitReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => moderationService.submitReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
        }
    });
}

export function useMuteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, expiresAt }) => moderationService.muteUser(userId, expiresAt),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blockedUsers });
        }
    });
}

export function useBlockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, reason }) => moderationService.blockUser(userId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blockedUsers });
        }
    });
}
