let mongoose = require("mongoose");

const SubComments = mongoose.model("SubComment", {
    commentObjectId: { type: mongoose.Types.ObjectId, required: true },
    profileObjectId: { type: mongoose.Types.ObjectId, required: true },
    creationDate: { type: Number, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number, default: 0 },
});

module.exports = SubComments;
