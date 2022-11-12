let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var ProfileSchema = mongoose.model("Profile", {
    name: String,
    nickName: String,
    email: String,
    password: String,
    phone: String,
    image: String,
    birthDate: String,
});

module.exports = ProfileSchema;
