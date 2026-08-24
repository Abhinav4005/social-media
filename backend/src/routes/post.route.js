import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { changePostStatus, commentLike, commentOnPost, createPost, deleteComment, deletePost, getAllPosts, getCommentLikes, getPostById, getPostFeed, getPostsBySearch, getPostsByUser, reactOnPost, savePostBookmark, updateComment, updatePost, getPostLikes, getSavedPosts, getWatchFeed } from "../controllers/post.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.fields([{ name: 'image' }, { name: 'video' }]), authenticateToken, createPost);
router.post("/create", upload.fields([{ name: 'image' }, { name: 'video' }]), authenticateToken, createPost);
router.put("/update", upload.fields([{ name: 'image' }, { name: 'video' }]), authenticateToken, updatePost);
router.delete("/delete", authenticateToken, deletePost);

router.get("/feed", authenticateToken, getPostFeed);
router.get("/watch", authenticateToken, getWatchFeed);
router.get("/all", authenticateToken, getAllPosts);
router.get("/user", authenticateToken, getPostsByUser);
router.get("/postByUser", authenticateToken, getPostsByUser);
router.get("/saved", authenticateToken, getSavedPosts);
router.get("/bookmarks", authenticateToken, getSavedPosts);
router.get("/search", authenticateToken, getPostsBySearch);

router.get("/postById", authenticateToken, getPostById);
router.post("/like", authenticateToken, reactOnPost);
router.post("/comment", authenticateToken, commentOnPost);
router.all("/comment/like", authenticateToken, (req, res, next) => {
    if (req.method === "POST") return commentLike(req, res, next);
    if (req.method === "GET") return getCommentLikes(req, res, next);
    next();
});
router.post("/save", authenticateToken, savePostBookmark);


router.get("/:id", authenticateToken, getPostById);
router.put("/:id", upload.fields([{ name: 'image' }, { name: 'video' }]), authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

router.post("/:id/comments", authenticateToken, commentOnPost);
router.put("/comments/:commentId", authenticateToken, updateComment);
router.delete("/comments/:commentId", authenticateToken, deleteComment);

router.post("/:id/likes", authenticateToken, reactOnPost);
router.get("/:id/likes", authenticateToken, getPostLikes);

router.post("/comments/:commentId/likes", authenticateToken, commentLike);
router.get("/comments/:commentId/likes", authenticateToken, getCommentLikes);

router.post("/:id/bookmarks", authenticateToken, savePostBookmark);
router.put("/:id/status", authenticateToken, changePostStatus);

export default router;
