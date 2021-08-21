// const express = require('express');
const mongoose = require('mongoose');

const Post = require("../models/Post");

const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Post.countDocuments({});
        const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPage: Math.ceil(total / LIMIT) });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await Post.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
        res.status(200).json({ data: posts });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new Post({ ...post, creator: req.userId });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(409).json({ message: err.message });
    }
}

const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    // const { title, message, creator, selectedFile, tags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        res.status(404).json({ message: "No post with this id" });
    }
    try {
        const post = { ...req.body, _id };
        const updatedPost = await Post.findByIdAndUpdate(_id, post, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        res.status(404).json({ message: "No post with this id" });
    }
    try {
        await Post.findByIdAndRemove(_id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

const likePost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthenticated" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "No post with this id" });
    }
    try {
        const post = await Post.findById(id);
        const index = post.likes.findIndex((id) => id === String(req.userId));
        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(201).json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

const commentPost = async (req, res) => {
    const { id } = req.params;
    if (!req.userId) {
        return res.status(403).json({ message: "Unauthenticated" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: "No post with this id" });
    }
    const { value } = req.body;
    try {
        const post = await Post.findById(id);
        post.comments.push(value);
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
        res.status(201).json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
}

module.exports = { getPosts, getPost, getPostsBySearch, createPost, updatePost, deletePost, likePost, commentPost };