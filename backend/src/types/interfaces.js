/**
 * @file interfaces.js
 * Domain Interfaces & Data Transfer Object (DTO) Contracts.
 * Enforces Interface Segregation Principle (ISP) and runtime contract security.
 */

/**
 * @typedef {Object} IUserDTO
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} [profileImage]
 * @property {string} [bio]
 * @property {string} [location]
 * @property {string} [about]
 */

/**
 * @typedef {Object} ISignUpDTO
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} ISignInDTO
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} ICreatePostDTO
 * @property {number} userId
 * @property {string} title
 * @property {string} description
 * @property {string[]} [comments]
 * @property {string} [status]
 */

/**
 * @typedef {Object} IStorageAdapter
 * @property {(file: Object, folder?: string) => Promise<{ url: string, fileId?: string } | null>} uploadFile
 * @property {(fileId: string) => Promise<boolean>} deleteFile
 */

/**
 * Sanitizes user objects to prevent leaking sensitive fields like password hashes or internal tokens.
 * @param {Object} user 
 * @returns {IUserDTO}
 */
export function sanitizeUserDTO(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
}

/**
 * Sanitizes post objects to ensure standard response contract.
 * @param {Object} post 
 * @returns {Object}
 */
export function sanitizePostDTO(post) {
    if (!post) return null;
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        image: post.image || "",
        video: post.video || "",
        userId: post.userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: sanitizeUserDTO(post.user),
        comments: post.comments || [],
        post_likes: post.post_likes || [],
    };
}
