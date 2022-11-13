let mongoose = require("mongoose");

const subComment = require("../model/SubComment");

var CommentSchema = mongoose.model("Comment", {
    postObjectId: { type: mongoose.Types.ObjectId, required: true },
    profileObjectId: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number, default: 0 },
    numberOfComments: { type: Number, default: 0 },
    subComments: [subComment.schema],
});

module.exports = CommentSchema;
