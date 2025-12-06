import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import uploadImageToImageKit, { replaceImageInImageKit } from "../utils/uploadImage.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                followers: {
                    include: {
                        follower: {
                            select: { id: true, name: true, profileImage: true, email: true }
                        }
                    }
                },
                following: {
                    include: {
                        following: {
                            select: { id: true, name: true, profileImage: true, email: true }
                        }
                    }
                },
                receivedFriendShips:true,
                requestedFriendShips: true,
                posts: {
                    select: {
                        id: true,
                        comments: true,
                        post_likes: true,
                        image: true,
                        title: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
            },
        })
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { password, ...userProfile } = user;
        res.status(200).json({ user: userProfile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching user profile." });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId, 10) },
            include: {
                followers: true,
                following: true,
                posts: true,
                postLikes: true,
                requestedFriendShips: true,
                receivedFriendShips: true,
            },
        })
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ message: "User Details fetched successfully", user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching user by ID." });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const { name, email, password, bio, location, about } = req.body;
        const profileImage = req?.files?.profileImage ? req.files.profileImage[0] : null;
        const coverImage = req?.files?.coverImage ? req.files.coverImage[0] : null;

        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        })

        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;
        if (bio) dataToUpdate.bio = bio;
        if (about) dataToUpdate.about = about;
        if (profileImage) {
            if( existingUser?.profileImage ){
                await replaceImageInImageKit(existingUser.profileImage, profileImage, "social-hub/users", existingUser?.profileImageId);
            }
            const uploadedImage = await uploadImageToImageKit(profileImage, "social-hub/users");
            dataToUpdate.profileImage = uploadedImage.url;
            dataToUpdate.profileImageId = uploadedImage.fileId;
        }
        if (coverImage) {
            if( existingUser?.coverImage ){
                await replaceImageInImageKit(existingUser.coverImage, coverImage, "social-hub/users/cover", existingUser?.coverImageId);
            }
            const uploadedCoverImage = await uploadImageToImageKit(coverImage, "social-hub/users/cover");
            dataToUpdate.coverImage = uploadedCoverImage.url;
            dataToUpdate.coverImageId = uploadedCoverImage.fileId;
        }
        if (location) dataToUpdate.location = location;
        if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        if (email) {
            const existingEmailUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingEmailUser && existingEmailUser.id !== userId) {
                return res.status(400).json({ error: "Email is already in use by another user" });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Exclude password from the response
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json({ message: "User profile updated successfully", user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating user profile." });
    }
}

export const searchUsersByQuery = async (req, res) => {
    try {
        const { search } = req.query;
        console.log("Search query:", search);
        console.log("typeof search:", typeof search);
        if (!search) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const searchTerm = search.trim();

        if (searchTerm.length < 3) {
            return res.status(400).json({ error: "Search query must be at least 3 characters long" });
        }

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                    { bio: { contains: searchTerm, mode: 'insensitive' } },
                    { location: { contains: searchTerm, mode: 'insensitive' } }
                ]
            }
        });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json({ users: usersWithoutPassword });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred while searching for users." });
    }
}

export const followUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { followingId } = req.body;
        if (!userId || !followingId) {
            return res.status(400).json({ error: "User ID and follow user ID are required" });
        }

        if (userId === parseInt(followingId, 10)) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        const existingFollow = await prisma.follower.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: parseInt(followingId, 10)
                }
            }
        });
        let follow;
        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: parseInt(followingId, 10)
                    }
                }
            });
            follow = null;
        } else {
            follow = await prisma.follower.create({
                data: {
                    followerId: userId,
                    followingId: parseInt(followingId, 10)
                },
            });
            await prisma.notification.create({
                data: {
                    type: "FOLLOW",
                    senderId: userId,
                    receiverId: parseInt(followingId, 10),
                }
            })
        }
        return res.status(200).json({ message: existingFollow ? "Unfollowed successfully" : "Followed successfully", follow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while following/unfollowing the user." });
    }
}

export const getFollowers = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthroized access" });
        }
        const followers = await prisma.follower.findMany({
            where: { followingId: parseInt(userId, 10) },
            include: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                    }
                }
            }
        });
        if (followers.length === 0) {
            return res.status(200).json({ message: "No followers found", followers: [] });
        }
        // Map to extract follower details
        const extractedFollowers = followers.map(follower => ({
            id: follower.follower.id,
            name: follower.follower.name,
            email: follower.follower.email,
            profileImage: follower.follower.profileImage
        }));
        res.status(200).json({ message: "Followers fetched successfully", followers: extractedFollowers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching followers." });
    }
}

export const getFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const following = await prisma.follower.findMany({
            where: { followerId: parseInt(userId, 10) },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                    }
                }
            }
        });
        if (following.length === 0) {
            return res.status(200).json({ message: "No following user found", following: [] });
        }
        // Map to extract following user details
        const extractedFollowing = following.map(follow => ({
            id: follow.following.id,
            name: follow.following.name,
            email: follow.following.email,
            profileImage: follow.following.profileImage
        }));
        res.status(200).json({ message: "Following users fetched successfully", following: extractedFollowing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching following users." });
    }
}

export const getUserFeed = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const following = await prisma.follower.findMany({
            where: { followerId: parseInt(userId, 10) },
            select: { followingId: true }
        })

        const followingIds = following.map(follow => follow.followingId);

        if (followingIds.length === 0) {
            return res.status(200).json({ error: "No following users found", posts: [] });
        }

        const posts = await prisma.post.findMany({
            where: {
                userId: { in: followingIds }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        userId: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImage: true
                            }
                        }
                    }
                },
                post_likes: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (posts.length === 0) {
            return res.status(200).json({ message: "No posts found from followed users", posts: [] });
        }

        res.status(200).json({ message: "User feed fetched successfully", posts });
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching user feed." });
    }
}

export const getAllPhotosOfUser = async (req, res) => {
    try {
        const userId = req.user.id;

        if(!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const photos = await prisma.post.findMany({
            where: { userId: parseInt(userId, 10), NOT: { image: null } },
            select: { image: true, id: true },
            orderBy: { createdAt: 'desc' }
        });

        const userPhotos = await prisma.user.findMany({
            where: { id: parseInt(userId, 10), NOT: { profileImage: null , coverImage: null } },
            select: { profileImage: true, coverImage: true, profileImageId: true, coverImageId: true }
        });

        const profileAndCoverImages = [];
        userPhotos.forEach(user => {
            if (user?.profileImage) {
                profileAndCoverImages.push({ id: 'profile-image', image: user.profileImage, fileId: user?.profileImageId });
            }
            if (user?.coverImage) {
                profileAndCoverImages.push({ id: 'cover-image', image: user.coverImage, fileId: user?.coverImageId });
            }
        });
        
        res.status(200).json({ 
            message: "Photos fetched successfully", 
            userImage: profileAndCoverImages,
            postImages: photos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching user photos." });
    }
}