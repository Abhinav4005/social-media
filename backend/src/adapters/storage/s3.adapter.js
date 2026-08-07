import { BaseStorageAdapter } from "./storage.adapter.js";

/**
 * Concrete AWS S3 Storage Adapter.
 * Demonstrates Open/Closed Principle (OCP): New storage backends can be added 
 * without modifying higher-level business services.
 */
export class S3StorageAdapter extends BaseStorageAdapter {
    async uploadFile(file, folder = "social-hub") {
        if (!file) return null;
        // Mock / placeholder for S3 SDK integration
        console.log(`[S3StorageAdapter] Uploading ${file.originalname} to folder ${folder}`);
        return {
            url: `https://s3.amazonaws.com/my-bucket/${folder}/${Date.now()}-${file.originalname}`,
            fileId: `s3-${Date.now()}`,
        };
    }

    async deleteFile(fileId) {
        console.log(`[S3StorageAdapter] Deleting file ${fileId}`);
        return true;
    }
}
