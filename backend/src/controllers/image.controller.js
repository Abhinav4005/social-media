import { defaultStorageAdapter } from "../adapters/storage/storage.factory.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const uploadImage = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return ApiResponse.error(res, "No file uploaded", 400);
        }

        const uploadedFile = await defaultStorageAdapter.uploadFile(file, "social-hub/chat-attachments");
        if (!uploadedFile) {
            return ApiResponse.error(res, "Failed to upload file", 500);
        }

        return ApiResponse.success(res, {
            url: uploadedFile.url,
            fileId: uploadedFile.fileId
        }, "File uploaded successfully", 200);
    } catch (error) {
        console.error("Error uploading image: ", error);
        return next(error);
    }
};