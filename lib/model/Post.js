const mongoose = require("mongoose");

const Comment = require("../model/Comment");

const PostSchema = mongoose.model("Post", {
    name: { type: String, required: false },
    image: { type: String, required: false },
    profileObjectId: { type: mongoose.Types.ObjectId, required: true },
    nickname: { type: String, required: false },
    postMedia: [{ type: String }],
    postDate: { type: Number, required: true },
    description: { type: String, required: true },
    postLikedBy: [{ type: mongoose.Types.ObjectId }],
    numberOfLikes: { type: Number, default: 0 },
    numberOfReposts: { type: Number, default: 0 },
    numberOfComments: { type: Number, default: 0 },
    comments: [Comment.schema],
});

module.exports = PostSchema;
