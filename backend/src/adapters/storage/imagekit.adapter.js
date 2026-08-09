import { BaseStorageAdapter } from "./storage.adapter.js";
import imagekit from "../../config/imagekit.js";

/**
 * Concrete ImageKit Storage Adapter.
 * Implements BaseStorageAdapter interface.
 */
export class ImageKitStorageAdapter extends BaseStorageAdapter {
    async uploadFile(file, folder = "social-hub") {
        if (!file || !file.buffer) return null;

        try {
            const base64Data = file.buffer.toString("base64");
            const mime = file.mimetype;

            const result = await imagekit.upload({
                file: `data:${mime};base64,${base64Data}`,
                fileName: file.originalname,
                folder: `/${folder}`,
            });

            return {
                url: result.url,
                fileId: result.fileId,
            };
        } catch (error) {
            console.error("ImageKit upload error:", error);
            return null;
        }
    }

    async deleteFile(fileId) {
        if (!fileId) return false;
        try {
            await imagekit.deleteFile(fileId);
            return true;
        } catch (error) {
            console.error("ImageKit delete error:", error);
            return false;
        }
    }
}
