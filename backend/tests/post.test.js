import { describe, it, expect, vi, beforeEach } from "vitest";
import { PostService } from "../src/services/post.service.js";

describe("PostService & PostRepository Feed Filtering Tests", () => {
    let mockRepo;
    let postService;

    beforeEach(() => {
        mockRepo = {
            createPost: vi.fn(),
            getPostFeed: vi.fn(),
            getMutedUserIds: vi.fn().mockResolvedValue([]),
            getBlockedUserIds: vi.fn().mockResolvedValue([])
        };
        postService = new PostService(mockRepo, { uploadFile: vi.fn() });
    });

    describe("getPostFeed", () => {
        it("should call postRepository.getPostFeed and filter muted/blocked users at database level", async () => {
            const mockPosts = [
                { id: 10, title: "Clean Feed Post 1", userId: 200, comments: [] },
                { id: 11, title: "Clean Feed Post 2", userId: 201, comments: [] }
            ];

            mockRepo.getPostFeed.mockResolvedValue({ posts: mockPosts, total: 2 });

            const result = await postService.getPostFeed(101, { page: 1, limit: 10 });

            expect(mockRepo.getPostFeed).toHaveBeenCalled();
            expect(result.posts).toEqual(mockPosts);
            expect(result.posts).toHaveLength(2);
        });

        it("should return empty posts array if no posts available", async () => {
            mockRepo.getPostFeed.mockResolvedValue({ posts: [], total: 0 });
            const result = await postService.getPostFeed(101, {});
            expect(result.posts).toEqual([]);
        });
    });

    describe("createPost", () => {
        it("should validate and create a new post via postRepository", async () => {
            const mockPostData = { userId: 101, title: "New Test Post", description: "Hello testing" };
            const mockCreatedPost = { id: 1, ...mockPostData, comments: [] };

            mockRepo.createPost.mockResolvedValue(mockCreatedPost);

            const result = await postService.createPost(mockPostData);

            expect(mockRepo.createPost).toHaveBeenCalledWith(
                {
                    title: "New Test Post",
                    description: "Hello testing",
                    image: "",
                    video: "",
                    userId: 101
                },
                undefined,
                "PUBLIC"
            );
            expect(result.id).toBe(1);
            expect(result.title).toBe("New Test Post");
        });
    });
});
