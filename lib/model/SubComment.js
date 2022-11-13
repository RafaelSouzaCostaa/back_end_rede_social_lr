let mongoose = require("mongoose");

var profileSchema = require("./Profile");

var SubCommentSchema = mongoose.model("SubComment", {
    commentProfileID: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number },
    numberOfComments: { type: Number },
});

module.exports = SubCommentSchema;
