import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { changePostStatus, commentLike, commentOnPost, createPost, deleteComment, deletePost, getAllPosts, getCommentLikes, getPostById, getPostFeed, getPostsBySearch, getPostsByUser, reactOnPost, updateComment, updatePost } from "../controllers/post.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", upload.fields([{ name: 'image' }, { name: 'video' }]), authenticateToken, createPost);

router.put("/update", upload.fields([{ name: 'image' }, { name: 'video' }]), authenticateToken, updatePost);

router.get("/postById", authenticateToken, getPostById);

router.delete("/delete", upload.fields([{ name: 'image' }, { name: 'video' }]), authenticateToken, deletePost);

router.get("/postByUser", authenticateToken, getPostsByUser);

router.get("/all", authenticateToken, getAllPosts);

router.post("/comment", authenticateToken, commentOnPost);

router.put("/update/comment", authenticateToken, updateComment);

router.delete("/delete/comment", authenticateToken, deleteComment);

router.get("/", authenticateToken, getPostsBySearch);

router.post("/like", authenticateToken, reactOnPost);

router.post("/comment/like", authenticateToken, commentLike);

router.get("/comment/like", authenticateToken, getCommentLikes);

router.get("/feed", authenticateToken, getPostFeed);

router.post("/change/status", authenticateToken, changePostStatus);

export default router;