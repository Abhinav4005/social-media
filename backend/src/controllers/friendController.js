import { defaultFriendService } from "../services/friend.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const sendFriendRequest = async (req, res, next) => {
    try {
        const addresseeId = req.params.addresseeId || req.body.addresseeId || req.query.addresseeId;
        const result = await defaultFriendService.sendFriendRequest(req.user.id, addresseeId);
        return ApiResponse.success(res, result, "Friend request sent successfully.", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error sending friend request:", error);
        return next(error);
    }
};

export const respondToFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id || req.query.requestId || req.body.requestId;
        const action = req.body.action || req.body.status || req.query.action || "ACCEPTED";
        const friendRequest = await defaultFriendService.respondToFriendRequest(
            req.user.id,
            requestId,
            action
        );
        return ApiResponse.success(res, { friendRequest }, `Friend request ${action.toLowerCase()}ed.`, 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error responding to friend request:", error);
        return next(error);
    }
};

export const getFriends = async (req, res, next) => {
    try {
        const friends = await defaultFriendService.getFriends(req.user.id);
        return ApiResponse.success(res, { friends }, "Friends retrieved successfully.", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error getting friends:", error);
        return next(error);
    }
};

export const getPendingRequests = async (req, res, next) => {
    try {
        const requests = await defaultFriendService.getPendingRequests(req.user.id);
        return ApiResponse.success(res, { requests }, "Pending requests retrieved successfully.", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error getting pending requests:", error);
        return next(error);
    }
};

export const getFriendRequest = getPendingRequests;

export const cancelFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id || req.query.requestId || req.body.requestId;
        const result = await defaultFriendService.cancelFriendRequest(req.user.id, requestId);
        return ApiResponse.success(res, { result }, "Friend request cancelled successfully.", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error cancelling friend request:", error);
        return next(error);
    }
};