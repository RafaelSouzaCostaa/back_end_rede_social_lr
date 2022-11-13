let mongoose = require("mongoose");

var profileSchema = require("./Profile");

var CommentSchema = mongoose.model("Comment", {
    profileObjectId: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    numberOfLikes: { type: Number, default: 0 },
    numberOfComments: { type: Number, default: 0 },
    comments: [
        {
            //LUIGGI PENSA COMIGO ISSO AQUI
            //ATENCAO AQUI (commentProfileObjectId) ESTOU PENSANDO EM PASSAR UM OBJ COM NOME,
            //URL DE FOTO, E _ID DE QUEM COMENTOU, POIS AI NÃO PRECISA FAZER UMA NOVA CONSULTA A
            //CADA COMENTARIO, SO BUSCA A IMAGEM, O NOME QUE JA TA SALVO NO COMENTARIO;
            //LEVANDO EM CONTA QUE VOU TER OS DADOS DO USUARIO QUE COMENTAR, ENTÃO SO ENVIAR JUNTO
            //AO COMENTARIO QUE FOI FEITO;
            commentProfileObjectId: {
                type: mongoose.Types.ObjectId,
                required: true,
            },
            comment: { type: String, required: true },
            numberOfLikes: { type: Number },
            numberOfComments: { type: Number },
        },
    ],
});

module.exports = CommentSchema;
