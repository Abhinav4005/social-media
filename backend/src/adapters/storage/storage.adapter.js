/**
 * Abstract Base Class defining the contract for Storage Adapters.
 * Enforces Liskov Substitution Principle (LSP) and Dependency Inversion Principle (DIP).
 */
export class BaseStorageAdapter {
    /**
     * Upload a file buffer to storage.
     * @param {Object} file - Express file object with buffer, mimetype, originalname
     * @param {string} folder - Target folder path
     * @returns {Promise<{ url: string, fileId?: string } | null>}
     */
    async uploadFile(file, folder = "social-hub") {
        throw new Error("uploadFile method must be implemented by subclass");
    }

    /**
     * Delete a file from storage by ID or key.
     * @param {string} fileId 
     * @returns {Promise<boolean>}
     */
    async deleteFile(fileId) {
        throw new Error("deleteFile method must be implemented by subclass");
    }
}
