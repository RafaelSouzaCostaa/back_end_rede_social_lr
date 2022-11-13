const mongoose = require("mongoose");

const PostSchema = new mongoose.model("Post", {
    userProfile: { type: mongoose.Types.ObjectId, required: true },
    postMedia: [{ type: String, required: true }],
    postDate: { type: Date },
    numberOfLikes: { type: Number },
    numberOfReposts: { type: Number },
    numberOfComments: { type: Number },
    comments: [{ comment: { type: mongoose.Types.ObjectId } }],
});

module.exports = PostSchema;
