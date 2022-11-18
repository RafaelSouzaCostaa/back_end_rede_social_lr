let mongoose = require("mongoose");

var ProfileSchema = mongoose.model("Profile", {
    name: { type: String, required: true },
    nickname: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    image: String,
    creationDate: { type: Number, required: true },
    birthDate: Number,
    followingObjectId: [{ _id: mongoose.Types.ObjectId }],
    followersObjectId: [{ _id: mongoose.Types.ObjectId }],
});

module.exports = ProfileSchema;
