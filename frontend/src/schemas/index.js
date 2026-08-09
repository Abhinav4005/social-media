import { z } from "zod";

export const postSchema = z.object({
    content: z
        .string()
        .min(1, "Post content cannot be empty")
        .max(5000, "Post content cannot exceed 5,000 characters"),
    visibility: z.enum(["PUBLIC", "FRIENDS_ONLY", "PRIVATE"]).default("PUBLIC"),
    tags: z.array(z.string()).optional(),
});

export const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(60, "Name cannot exceed 60 characters"),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    about: z.string().max(1000, "About details cannot exceed 1,000 characters").optional(),
    location: z.string().max(100, "Location cannot exceed 100 characters").optional(),
    website: z
        .string()
        .url("Please enter a valid web URL")
        .or(z.literal(""))
        .optional(),
});

export const commentSchema = z.object({
    content: z
        .string()
        .min(1, "Comment text cannot be empty")
        .max(1000, "Comment text cannot exceed 1,000 characters"),
});

export const groupSchema = z.object({
    name: z
        .string()
        .min(3, "Group name must be at least 3 characters")
        .max(80, "Group name cannot exceed 80 characters"),
    description: z.string().max(500, "Group description cannot exceed 500 characters").optional(),
    privacy: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
});
