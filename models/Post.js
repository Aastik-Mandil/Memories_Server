const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: { type: String },
    message: { type: String },
    name: { type: String },
    creator: { type: String },
    tags: { type: [String], default: [] },
    selectedFile: { type: String },
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
}, {
    timestamp: true,
});


module.exports = mongoose.model("Post", PostSchema);