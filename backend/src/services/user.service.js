import bcrypt from "bcryptjs";
import { defaultUserRepository } from "../repositories/user.repository.js";
import { defaultStorageAdapter } from "../adapters/storage/storage.factory.js";
import { SecurityValidator } from "../utils/security.validator.js";
import { sanitizeUserDTO } from "../types/interfaces.js";

/**
 * User Service managing user profile logic, email update constraints, and image uploads via storage adapter.
 * Fulfills SRP, OCP, DIP, ISP, and Security Validation.
 */
export class UserService {
    constructor(userRepository = defaultUserRepository, storageAdapter = defaultStorageAdapter) {
        this.userRepository = userRepository;
        this.storageAdapter = storageAdapter;
    }

    async getUserProfile(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const user = await this.userRepository.findById(cleanUserId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        return sanitizeUserDTO(user);
    }

    async getUserById(userIdParam) {
        const cleanUserId = SecurityValidator.validateId(userIdParam, "UserId");
        const user = await this.userRepository.findByIdWithFullDetails(cleanUserId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        return sanitizeUserDTO(user);
    }

    async updateUserProfile(userId, { name, email, password, bio, location, about, files }) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const existingUser = await this.userRepository.findById(cleanUserId);
        if (!existingUser) {
            throw { status: 404, message: "User not found" };
        }

        const profileImageFile = files?.profileImage ? files.profileImage[0] : null;
        const coverImageFile = files?.coverImage ? files.coverImage[0] : null;

        const dataToUpdate = {};
        if (name) dataToUpdate.name = SecurityValidator.sanitizeString(name);
        if (bio) dataToUpdate.bio = SecurityValidator.sanitizeString(bio);
        if (about) dataToUpdate.about = SecurityValidator.sanitizeString(about);
        if (location) dataToUpdate.location = SecurityValidator.sanitizeString(location);

        if (email && email !== existingUser.email) {
            const cleanEmail = SecurityValidator.validateEmail(email);

            if (existingUser.emailLastModified) {
                const lastModified = new Date(existingUser.emailLastModified);
                const sixtyDayLater = new Date(lastModified);
                sixtyDayLater.setDate(sixtyDayLater.getDate() + 60);

                if (new Date() < sixtyDayLater) {
                    throw { status: 400, message: "You can change email only once every 60 days" };
                }
            }

            const existingEmailUser = await this.userRepository.findByEmail(cleanEmail);
            if (existingEmailUser && existingEmailUser.id !== cleanUserId) {
                throw { status: 400, message: "Email is already in use by another user" };
            }

            dataToUpdate.email = cleanEmail;
            dataToUpdate.emailLastModified = new Date();
        }

        if (profileImageFile) {
            if (existingUser.profileImageId) {
                await this.storageAdapter.deleteFile(existingUser.profileImageId);
            }
            const uploaded = await this.storageAdapter.uploadFile(profileImageFile, "social-hub/users");
            if (uploaded) {
                dataToUpdate.profileImage = uploaded.url;
                dataToUpdate.profileImageId = uploaded.fileId;
            }
        }

        if (coverImageFile) {
            if (existingUser.coverImageId) {
                await this.storageAdapter.deleteFile(existingUser.coverImageId);
            }
            const uploadedCover = await this.storageAdapter.uploadFile(coverImageFile, "social-hub/users/cover");
            if (uploadedCover) {
                dataToUpdate.coverImage = uploadedCover.url;
                dataToUpdate.coverImageId = uploadedCover.fileId;
            }
        }

        if (password) {
            const cleanPassword = SecurityValidator.validatePassword(password);
            dataToUpdate.password = await bcrypt.hash(cleanPassword, 10);
        }

        if (Object.keys(dataToUpdate).length === 0) {
            throw { status: 400, message: "No valid fields to update" };
        }

        const updatedUser = await this.userRepository.updateUser(cleanUserId, dataToUpdate);
        return sanitizeUserDTO(updatedUser);
    }

    async searchUsers(query, currentUserId) {
        if (!query || query.trim() === "") {
            return [];
        }
        const cleanUserId = SecurityValidator.validateId(currentUserId, "UserId");
        const users = await this.userRepository.searchUsers(query.trim(), cleanUserId);
        return users.map(user => sanitizeUserDTO(user));
    }

    async toggleFollowUser(followerId, followingId) {
        const cleanFollowerId = SecurityValidator.validateId(followerId, "FollowerId");
        const cleanFollowingId = SecurityValidator.validateId(followingId, "FollowingId");

        if (cleanFollowerId === cleanFollowingId) {
            throw { status: 400, message: "You cannot follow yourself" };
        }

        const targetUser = await this.userRepository.findById(cleanFollowingId);
        if (!targetUser) {
            throw { status: 404, message: "User to follow not found" };
        }

        return await this.userRepository.toggleFollow(cleanFollowerId, cleanFollowingId);
    }

    async getFollowers(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const followers = await this.userRepository.getFollowers(cleanUserId);
        return followers.map(f => sanitizeUserDTO(f.follower));
    }

    async getFollowing(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const following = await this.userRepository.getFollowing(cleanUserId);
        return following.map(f => sanitizeUserDTO(f.following));
    }

    async getUserFeed(userId, page = 1, limit = 10) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.userRepository.getUserFeed(cleanUserId, page, limit);
    }

    async getAllPhotosOfUser(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.userRepository.getAllPhotosOfUser(cleanUserId);
    }
}

export const defaultUserService = new UserService();
