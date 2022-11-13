const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment = require("../model/Comment");

const PostSchema = mongoose.model("Post", {
    userProfile: { type: mongoose.Types.ObjectId, required: true },
    postMedia: [{ type: String, required: true }],
    postDate: { type: Date },
    numberOfLikes: { type: Number },
    numberOfReposts: { type: Number },
    numberOfComments: { type: Number },
    comments: [{ type: [comment.schema], default: [] }],
});

module.exports = PostSchema;
