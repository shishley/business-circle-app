import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* crudREAD */
router.get("/", verifyToken, getFeedPosts);/* grab feed in homepage */
router.get("/:userId/posts", verifyToken, getUserPosts);/* grab users post only in profile   */

/* crudUPDATE */
router.patch("/:id/like", verifyToken, likePost);/* liking post  */

export default router;