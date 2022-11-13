let mongoose = require("mongoose");

var SubComments = mongoose.model("SubComment", {
    profileObjectId: { type: mongoose.Types.ObjectId, required: true },
    commentObjectId: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number, default: 0 },
});

module.exports = SubComments;
