import { ImageKitStorageAdapter } from "./imagekit.adapter.js";
import { S3StorageAdapter } from "./s3.adapter.js";

/**
 * Storage Factory enforcing Open/Closed Principle (OCP) through Polymorphic Registry.
 * Eliminates switch/if-else statements.
 * New storage providers register dynamically without mutating factory source code.
 */
export class StorageFactory {
    static registry = new Map();

    /**
     * Polymorphically register a new Storage Adapter constructor.
     * @param {string} name 
     * @param {typeof import("./storage.adapter.js").BaseStorageAdapter} AdapterClass 
     */
    static registerProvider(name, AdapterClass) {
        this.registry.set(name.toLowerCase(), AdapterClass);
    }

    /**
     * Instantiate active Storage Adapter dynamically from registry without switch/if-else.
     * @param {string} provider 
     * @returns {import("./storage.adapter.js").BaseStorageAdapter}
     */
    static getStorageAdapter(provider = process.env.STORAGE_PROVIDER || "imagekit") {
        const key = provider.toLowerCase();
        const AdapterClass = this.registry.get(key) || this.registry.get("imagekit");
        if (!AdapterClass) {
            throw new Error(`No registered storage adapter found for provider: ${provider}`);
        }
        return new AdapterClass();
    }
}

// Polymorphic registration
StorageFactory.registerProvider("imagekit", ImageKitStorageAdapter);
StorageFactory.registerProvider("s3", S3StorageAdapter);

export const defaultStorageAdapter = StorageFactory.getStorageAdapter();
