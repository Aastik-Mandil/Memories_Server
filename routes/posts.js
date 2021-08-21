const express = require("express");
const { getPosts, getPost, getPostsBySearch, createPost, updatePost, deletePost, likePost, commentPost } = require("../controllers/posts");

const router = express.Router();

const { auth } = require("../middleware/auth");


router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/search", getPostsBySearch);
router.post("/", auth, createPost);//auth, 
router.patch("/:id", auth, updatePost);//auth, 
router.delete("/:id", auth, deletePost);// auth, 
router.patch("/:id/likePost", auth, likePost);// auth, 
router.post("/:id/commentPost", auth, commentPost);// auth, 

module.exports = router;

