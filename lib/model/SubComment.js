let mongoose = require("mongoose");

var SubComments = mongoose.model("SubComment", {
    commentObjectId: { type: mongoose.Types.ObjectId, required: true },
    profileObjectId: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number, default: 0 },
});

module.exports = SubComments;
