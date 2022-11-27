let mongoose = require("mongoose");
var validator = require("validator");

var ProfileSchema = mongoose.model("Profile", {
    name: { type: String,trim: true, required: true },
    nickname: { type: String, unique: true, trim: true, required: true },
    email: { type: String, unique: true, required: true, trim: true,
        //  validate:{
        //     validator: validator.isEmail,
        //     message: "Email invalido"
        //  }
        },
    password: { type: String, trim: true, required: true },
    description: { type: String, default: "" },
    phone: String,
    image: String,
    creationDate: { type: Number, required: true },
    lastSeen: String,
    birthDate: Number,
    followingObjectId: [{ _id: mongoose.Types.ObjectId }],
    followersObjectId: [{ _id: mongoose.Types.ObjectId }],
});

module.exports = ProfileSchema;
