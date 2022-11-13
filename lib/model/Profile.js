let mongoose = require("mongoose");

var ProfileSchema = mongoose.model("Profile", {
    name: String,
    nickName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String, select: false },
    phone: { type: String, select: false },
    image: String,
    birthDate: String,
});

module.exports = ProfileSchema;
