const mongoose = require("mongoose");

const Comment = require("../model/Comment");

const PostSchema = mongoose.model("Post", {
    profileObjectID: { type: mongoose.Types.ObjectId, required: true },
    postMedia: [{ type: String, required: true }],
    postDate: { type: Number },
    numberOfLikes: { type: Number },
    numberOfReposts: { type: Number },
    numberOfComments: { type: Number },
    comments: [Comment.schema],
});

module.exports = PostSchema;
