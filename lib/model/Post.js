const mongoose = require("mongoose");
mongoose.Promisse = global.Promise;

var commentSchema = require("./Comment");
var profileSchema = require("./Profile");

const postSchema = new mongoose.Schema({
    userProfile: { type: profileSchema, required: true },
    postMedia: [{ type: String, required: true }],
    postDate: { type: Date },
    numberOfLikes: { type: Number },
    numberOfReposts: { type: Number },
    numberOfComments: { type: Number },
    comments: [{ comment: { type: commentSchema } }],
});

const modelName = "post";

if (mongoose.connection && mongoose.connection.models[modelName]) {
    module.exports = mongoose.connection.models[modelName]; //Conexão
} else {
    module.exports = mongoose.model(modelName, postSchema); //Criar nova conexão
}
