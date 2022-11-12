let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var profileSchema = require("./Profile");

var subCommentSchema = new Schema({
    commentProfile: { type: profileSchema, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number },
    numberOfComments: { type: Number },
    comments: [{ comment: { type: this } }],
});

var modelName = "subComment";

if (mongoose.connection && mongoose.connection.models[modelName]) {
    module.exports = mongoose.connection.models[modelName]; //Conexão
} else {
    module.exports = mongoose.model(modelName, subCommentSchema); //Criar nova conexão
}
