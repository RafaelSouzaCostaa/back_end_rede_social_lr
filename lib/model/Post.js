const mongoose = require("mongoose");

const Comment = require("../model/Comment");

const PostSchema = mongoose.model("Post", {
    postMedia: [{ type: String, required: true }],
    postDate: { type: Number, required: true },
    description: { type: String, required: true },
    numberOfLikes: { type: Number, default: 0 },
    numberOfReposts: { type: Number, default: 0 },
    numberOfComments: { type: Number, default: 0 },
    comments: [Comment.schema],
});

module.exports = PostSchema;
