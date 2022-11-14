let mongoose = require("mongoose");

var ProfileSchema = mongoose.model("Profile", {
    name: String,
    nickName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    image: String,
    birthDate: { type: Date },
    followingObjectId: [{ _id: mongoose.Types.ObjectId }],
    followersObjectId: [{ _id: mongoose.Types.ObjectId }],
});

module.exports = ProfileSchema;
