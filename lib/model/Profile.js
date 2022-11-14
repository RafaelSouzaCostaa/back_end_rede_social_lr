let mongoose = require("mongoose");

var ProfileSchema = mongoose.model("Profile", {
    name: String,
    nickName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String, select: false },
    image: String,
    birthDate: { type: Date },
    followingObjectId: [mongoose.Types.ObjectId],
    followersObjectId: [mongoose.Types.ObjectId],
});

module.exports = ProfileSchema;
