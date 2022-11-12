let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var profileSchema = require("./Profile");
var subComment = require("./SubComment");

var commentSchema = new Schema({
    commentProfile: { type: profileSchema, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number },
    numberOfComments: { type: Number },
    comments: [{ comment: { type: subComment } }],
});

var modelName = "comment";

if (mongoose.connection && mongoose.connection.models[modelName]) {
    module.exports = mongoose.connection.models[modelName]; //Conexão
} else {
    module.exports = mongoose.model(modelName, commentSchema); //Criar nova conexão
}
