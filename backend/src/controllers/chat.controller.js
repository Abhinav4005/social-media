import { defaultChatService } from "../services/chat.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createRoom = async (req, res, next) => {
    try {
        const { isExisting, room } = await defaultChatService.createRoom({
            userId: req.user.id,
            name: req.body.name,
            type: req.body.type,
            memberIds: req.body.memberIds,
        });

        const statusCode = isExisting ? 200 : 201;
        const message = isExisting ? "DM Room already exists" : `${req.body.type} Room created successfully`;
        return ApiResponse.success(res, { room }, message, statusCode);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error creating room:", error);
        return next(error);
    }
};

export const getRooms = async (req, res, next) => {
    try {
        const rooms = await defaultChatService.getRooms(req.user.id);
        return ApiResponse.success(res, { rooms }, "Rooms retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching rooms:", error);
        return next(error);
    }
};

export const getRoomMessages = async (req, res, next) => {
    try {
        const messages = await defaultChatService.getRoomMessages(req.params.roomId);
        return ApiResponse.success(res, { messages }, "Room messages retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching room messages:", error);
        return next(error);
    }
};

export const getMessages = getRoomMessages;

export const addMemberToRoom = async (req, res, next) => {
    try {
        const roomId = req.params.roomId || req.body.roomId;
        const memberId = req.body.memberId || req.body.userId;
        if (!roomId || !memberId) {
            return ApiResponse.error(res, "roomId and memberId are required", 400);
        }
        const member = await defaultChatService.addMemberToRoom(roomId, memberId);
        return ApiResponse.success(res, { member }, "Member added successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error adding member to room:", error);
        return next(error);
    }
};

export const changeGroupName = async (req, res, next) => {
    try {
        const roomId = req.params.roomId || req.body.roomId;
        const name = req.body.name;
        if (!roomId || !name) {
            return ApiResponse.error(res, "roomId and name are required", 400);
        }
        const room = await defaultChatService.changeGroupName(roomId, name);
        return ApiResponse.success(res, { room }, "Group name updated successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error changing group name:", error);
        return next(error);
    }
};

export const deleteMessage = async (req, res, next) => {
    try {
        const messageId = parseInt(req.params.messageId || req.params.id, 10);
        if (isNaN(messageId)) {
            return ApiResponse.error(res, "Invalid messageId", 400);
        }
        const deletedMessage = await defaultChatService.deleteMessage(messageId, req.user.id);
        return ApiResponse.success(res, { messageId, deletedMessage }, "Message deleted successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error deleting message:", error);
        return next(error);
    }
};