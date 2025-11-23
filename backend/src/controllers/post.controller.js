import prisma from "../config/db.js";
import { nestComments } from "../helper/formatComment.js";
import { FRIENDSHIPSTATUS, LIKESTATUS, POSTVISIBLITYSTATUS } from "../lib/type.js";
import uploadImageToImageKit from "../utils/uploadImage.js";

export const createPost = async (req, res) => {
    try {
        const { title, description, comments, status } = req.body;
        console.log("req.body", req.body);
        const image = req?.files?.image ? req.files.image[0] : null;
        console.log("image", image);
        const video = req?.files?.video ? req.files.video[0] : null;
        const userId = req.user.id;

        const imageUrl = image ? await uploadImageToImageKit(image, "social-hub/images").catch(() => null) : null;
        const videoUrl = video ? await uploadImageToImageKit(video, "social-hub/videos").catch(() => null) : null;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                description,
                image: imageUrl ? imageUrl : "",
                video: videoUrl.url,
                userId,
                ...(comments?.length ?
                    { comments: { create: comments.map(content => ({ content, userId })) } }
                    : {})
            },
            include: {
                comments: true,
            }
        });

        if (!newPost) {
            return res.status(500).json({ error: "Failed to create post" });
        }
        let postStatus;
        if(status === POSTVISIBLITYSTATUS.CUSTOM) {
            postStatus = POSTVISIBLITYSTATUS.CUSTOM
        }
        else if(status === POSTVISIBLITYSTATUS.PRIVATE){
            postStatus = POSTVISIBLITYSTATUS.PRIVATE
        }
        else if(status === POSTVISIBLITYSTATUS.FRIENDS) {
            postStatus = POSTVISIBLITYSTATUS.FRIENDS;
        }
        else {
            postStatus = POSTVISIBLITYSTATUS.PUBLIC;
        }

        await prisma.postPrivacy.create({
            data:{
                postId: newPost.id,
                visibility: postStatus,
            }
        })
        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while creating the post" });
    }
}

export const updatePost = async (req, res) => {
    try {
        const postId = parseInt(req.query.postId, 10);
        // console.log("Post ID from query:", postId);
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        if (isNaN(postId)) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        const { title, description } = req.body;
        const image = req.files.image ? req.files.image[0] : null;
        const video = req.files.video ? req.files.video[0] : null;
        const postToUpdate = {};
        if (title) postToUpdate.title = title;
        if (description) postToUpdate.description = description;
        if (image) postToUpdate.image = image ? image.originalname : null;
        if (video) postToUpdate.video = video ? video.originalname : null;

        if (Object.keys(postToUpdate).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const updatedPost = await prisma.post.updateMany({
            where: { id: postId, userId: userId },
            data: postToUpdate,
        });

        if (updatedPost.count === 0) {
            return res.status(404).json({ error: "Post not found or you do not have permission to update this post" });
        }

        return res.status(200).json({ message: "Post updated successfully", post: { id: postId, ...postToUpdate } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while updating the post" });
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = parseInt(req.query.postId, 10);
        // console.log("Post ID from query:", postId);
        if (isNaN(postId)) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                comments: true,
                post_likes: true,
            },
        })

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json({ post: post });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while retrieving the post" });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.query.postId, 10);
        // console.log("Post ID from query:", postId);
        if (isNaN(postId)) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const deletedPost = await prisma.post.delete({
            where: { id: postId, userId: userId },
        });

        return res.status(200).json({ message: "Post deleted successfully", postId: postId, post: deletedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while deleting the post" });
    }
}

export const getPostsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const posts = await prisma.post.findMany({
            where: { userId: userId },
            include: {
                comments: true,
                post_likes: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: "No posts found for this user" });
        }

        return res.status(200).json({ posts: posts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while retrieving posts" });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                comments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: "No posts found" });
        }

        console.log(`Retrieved ${posts.length} posts`);

        return res.status(200).json({ posts: posts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while retrieving all posts" });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const postId = parseInt(req.query.postId, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const { content, parentId } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        let parsedParentId = null;
        if (parentId) {
            parsedParentId = parseInt(parentId, 10);
            if (isNaN(parsedParentId)) {
                return res.status(400).json({ error: "Parent Comment ID must be a number" });
            }
            if (parsedParentId <= 0) {
                return res.status(400).json({ error: "Parent Comment ID must be a positive number" });
            }
            const parentComment = await prisma.comment.findUnique({
                where: { id: parsedParentId },
            });

            if (!parentComment) {
                return res.status(404).json({ error: "Parent comment not found" });
            }
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId,
                parentId: parsedParentId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    }
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                            }
                        }
                    }
                },
                post: { select: { userId: true } }
            }
        });

        if (newComment.post.userId !== userId) {
            await prisma.notification.create({
                data: {
                    type: "COMMENT",
                    senderId: userId,
                    receiverId: newComment.post.userId,
                    postId: postId,
                    commentId: newComment.id,
                }
            });
        }
        return res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while adding the comment" });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.query.commentId, 10);
        if (isNaN(commentId)) {
            return res.status(400).json({ error: "Comment ID is required" });
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const comment = await prisma.comment.findFirst({
            where: { id: commentId, userId: userId },
        })

        if (!comment) {
            return res.status(404).json({ error: "Comment not found or you do not have permission to delete this comment" });
        }

        if (comment.parentId) {
            const deletedNestedComment = await prisma.comment.delete({
                where: { id: commentId },
            });
            return res.status(200).json({ message: "Nested comment deleted successfully", comment: deletedNestedComment });
        }

        await prisma.comment.deleteMany({
            where: { parentId: commentId },
        });

        await prisma.comment.delete({
            where: { id: commentId },
        });

        // If the comment is deleted successfully, return a success message
        return res.status(200).json({ message: "Comment deleted successfully", commentId: commentId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while deleting the comment" });
    }
}

export const updateComment = async (req, res) => {
    try {
        const commentId = parseInt(req.query.commentId, 10);
        const postId = parseInt(req.query.postId, 10);
        if (isNaN(commentId)) {
            return res.status(400).json({ error: "Comment ID is required" });
        }
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const { content, parentId } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        let parsedParentId = null;
        if (parentId) {
            parsedParentId = parseInt(parentId, 10);
            if (isNaN(parsedParentId)) {
                return res.status(400).json({ error: "Parent Comment ID must be a number" });
            }
            if (parsedParentId <= 0) {
                return res.status(400).json({ error: "Parent Comment ID must be a positive number" });
            }
            const parentComment = await prisma.comment.findUnique({
                where: { id: parsedParentId },
            });
            if (!parentComment) {
                return res.status(404).json({ error: "Parent comment not found" });
            }
        };

        const updatedComment = await prisma.comment.update({
            where: { id: commentId, userId: userId },
            data: {
                content,
                parentId: parsedParentId,
                postId: postId,
                userId: userId
            }
        });
        return res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while updating the comment" });
    }
}

export const commentLike = async (req, res) => {
    try {
        const postId = parseInt(req.query.postId, 10);
        const commentId = parseInt(req.query.commentId, 10);
        if (isNaN(postId) || isNaN(commentId)) {
            return res.status(400).json({ error: "Post ID and Comment ID are required" });
        }

        const { status } = req.body;

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: {
                    commentId: commentId,
                    userId: userId,
                }
            }
        })
        let reaction;
        if(!existingLike) {
            reaction = await prisma.commentLike.create({
                data: {
                    commentId: commentId,
                    userId: userId,
                    status: LIKESTATUS.LIKE
                },
                include: { 
                    comment: { select: { userId: true } }
                }
            });
            if (status === LIKESTATUS.LIKE && reaction.userId !== userId) {
                await createNotification("LIKE", userId, reaction.userId, postId);
            }
        } else if (existingLike.status === status) {
            await prisma.commentLike.delete({
                where: {
                    commentId_userId: {
                        commentId: commentId,
                        userId: userId,
                    }
                }
            });
            reaction = null;
        } else {
            reaction = await prisma.commentLike.update({
                where: {
                    commentId_userId: {
                        commentId: commentId,
                        userId: userId,
                    }
                },
                data: {
                    status: status,
                },
                include: {
                    comment: { select: { userId: true } }
                }
            });
            if( status === LIKESTATUS.LIKE && reaction.userId !== userId) {
                await createNotification("LIKE", userId, reaction.userId, postId);
            }
        }

        const likeCount = await prisma.commentLike.count({
            where: {
                commentId: commentId,
            }
        });
        return res.status(200).json({ 
            message: "Comment liked successfully", 
            reaction: reaction,  
            likeCount: likeCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while liking the comment" });
    }
}

export const getCommentLikes = async (req, res) => {
    try {
        const { commentId} = req.query;
        if (!commentId) {
            return res.status(400).json({ error: "Comment ID is required" });
        }

        const likes = await prisma.commentLike.findMany({
            where: {
                commentId: parseInt(commentId, 10),
            },
        });

        if(!likes.length) {
            return res.status(404).json({ error: "No likes found for this comment" });
        }

        return res.status(200).json({ message: "Comment Likes fetched successfully", commentLikes: likes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching comment likes" });
    }
}

export const getPostsBySearch = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const searchTerm = search && search.trim();

        if (searchTerm.length < 3) {
            return res.status(400).json({ error: "Search query must be at least 3 characters long" });
        }

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
                    { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
                    { comments: { some: { content: { contains: searchTerm, mode: 'insensitive' } } } }
                ]
            }
        });
        return res.status(200).json({ posts: posts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching posts" });
    }
}

const createNotification = async (type, senderId, receiverId, postId) => {
    try {
        const existingNotification = await prisma.notification.findFirst({
            where: {
                type: type,
                senderId: senderId,
                receiverId: receiverId,
                postId: postId
            }
        });
        if (!existingNotification) {
            await prisma.notification.create({
                data: {
                    type: type,
                    senderId: senderId,
                    receiverId: receiverId,
                    postId: postId
                }
            });
        }
    } catch (error) {
        console.error("Error creating notification:", error);
        throw new Error("Failed to create notification");
    }
}

export const reactOnPost = async (req, res) => {
    try {
        const postId = parseInt(req.query.postId, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ error: "Post ID is required" });
        }
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const { status } = req.body;
        if (!status || !Object.values(LIKESTATUS).includes(status)) {
            return res.status(400).json({ error: "Valid reaction status is required (LIKE/DISLIKE)" });
        }

        const existingReaction = await prisma.postLike.findUnique({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: userId
                }
            }
        });
        let reaction;
        if (!existingReaction) {
            reaction = await prisma.postLike.create({
                data: {
                    postId,
                    userId,
                    status
                },
                include: {
                    post: { select: { userId: true } }
                }
            });
            if (status === LIKESTATUS.LIKE && reaction.post.userId !== userId) {
                await createNotification("LIKE", userId, reaction.post.userId, postId);
            }
        } else if (existingReaction.status === status) {
            await prisma.postLike.delete({
                where: {
                    postId_userId: {
                        postId: postId,
                        userId: userId
                    }
                }
            });
            reaction = null;
        } else {
            reaction = await prisma.postLike.update({
                where: {
                    postId_userId: {
                        postId: postId,
                        userId: userId
                    }
                },
                data: {
                    status: status
                },
                include: {
                    post: { select: { userId: true } }
                }
            });
            if (status === LIKESTATUS.LIKE && reaction.post.userId !== userId) {
                await createNotification("LIKE", userId, reaction.post.userId, postId);
            }
        }

        const likeCount = await prisma.postLike.count({
            where: {
                postId: postId,
                status: LIKESTATUS.LIKE
            }
        });
        const dislikeCount = await prisma.postLike.count({
            where: {
                postId: postId,
                status: LIKESTATUS.DISLIKE
            }
        });

        return res.status(201).json({
            message: "Reaction created successfully",
            reaction: reaction,
            likeCount: likeCount,
            dislikeCount: dislikeCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while reacting to the post" });
    }
}

export const getPostLikes = async (req, res) => {
    try {
        const postId = parseInt(req.query.postId, 10);
        if (isNaN(postId)) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        const likes = await prisma.postLike.count({
            where: {
                postId: postId,
                status: LIKESTATUS.LIKE,
            }
        });

        return res.status(200).json({ message:"Likes retrieved successfully", likes: likes})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while retrieving likes" });
    }
}

export const getPostFeed = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const { limit = 10, page = 1 } = req.query;

        const followingLimit = Math.floor(limit * 0.7);
        const topLimit = limit - followingLimit;

        const following = await prisma.follower.findMany({
            where: { followerId: userId },
            select: { followingId: true}
        });

        const followingIds = following.map(f => f.followingId);

        const friends = await prisma.friendShip.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: FRIENDSHIPSTATUS.ACCEPTED},
                    { addresseeId: userId, status: FRIENDSHIPSTATUS.ACCEPTED},
                ]
            },
            include: {
                requester: true,
                addressee: true,
            }
        })

        const friendIds = friends.map(f => (f.requesterId === userId ? f.addresseeId : f.requesterId ));

        // console.log("Following IDs:", followingIds);
        console.log("Friend IDs:", friendIds);

        const uniqueIds = Array.from(new Set([...followingIds, ...friendIds]));

        const posts = await prisma.post.findMany({
           where: { userId: { in: uniqueIds } },
            take: followingLimit,
            skip: (page - 1) * followingLimit,
            
            include: {
                post_likes: true,
                comments: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        posts.forEach(post => {
            post.comments = nestComments(post.comments);
        })

        const topPosts = await prisma.post.findMany({
            take: topLimit,
            skip: (page - 1) * topLimit,
            include: {
                post_likes: true,
                comments: true,
                user: { select: { id: true, name: true, profileImage: true } }
            },
            orderBy: {
                post_likes: { _count: 'desc' }
            }
        });

        topPosts.forEach(post => {
            post.comments = nestComments(post.comments);
        })

        const allPosts = [...posts, ...topPosts].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const totalPosts = await prisma.post.count();
        const hasMore = page * limit < totalPosts;
        
        if (!allPosts || allPosts.length === 0) {
            return res.status(404).json({ error: "No posts found" });
        }
        
        return res.status(200).json({ 
            message: "Posts retrieved successfully", 
            posts: allPosts,
            hasMore: hasMore,
            page: Number(page),
            totalPosts: totalPosts
         });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while retrieving posts" });
    }
}

export const changePostStatus = async (req, res) => {
    try {
        const { postId, status} = req.body;

        if(!postId || !status) {
            return res.status(400).json({ error: "Post ID and status are required" });
        }

        const userId = req.user.id;
        if(!userId) {
            return res.status(401).json({ error:"Unauthorized access"});
        }

        let postStatus;
        if(status === POSTVISIBLITYSTATUS.CUSTOM) {
            postStatus = POSTVISIBLITYSTATUS.CUSTOM
        }
        else if(status === POSTVISIBLITYSTATUS.PRIVATE){
            postStatus = POSTVISIBLITYSTATUS.PRIVATE
        }
        else if(status === POSTVISIBLITYSTATUS.FRIENDS) {
            postStatus = POSTVISIBLITYSTATUS.FRIENDS;
        }
        else {
            postStatus = POSTVISIBLITYSTATUS.PUBLIC;
        }

        const updatePostStatus = await prisma.postPrivacy.update({
            where: { postId: parseInt(postId, 10)},
            data: {
                postId: parseInt(postId, 10),
                visibility: postStatus
            }
        })

        return res.status(200).json({
            message: "Post status changes successfully",
            status: updatePostStatus
        })
    } catch (error) {
        console.error("Error in changing post status", error);
        return res.status(500).json({ error: "Error in changing post status"})
    }
}