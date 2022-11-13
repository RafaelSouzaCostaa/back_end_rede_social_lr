let mongoose = require("mongoose");

var profileSchema = require("./Profile");
const subComment = require("../model/SubComment");

var CommentSchema = mongoose.model("Comment", {
    profileObjectId: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number, default: 0 },
    numberOfComments: { type: Number, default: 0 },
    comments: { type: [subComment.schema] },
});

module.exports = CommentSchema;
