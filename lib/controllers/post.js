const mongoose = require("mongoose");
const Post = require("../model/Post");

module.exports = {
    createPost: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
            #swagger.summary = '//IMPLEMENTAR'
            #swagger.description = '//IMPLEMENTAR'
            #swagger.parameters = [
                {userProfile: 'Luiggi', type: 'String'},
                
            ]
        */

        res.status(200).json({ msg: "Post ok" });
    },
    getAllPost: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
          
        */
        res.status(200).json({ msg: "Busca de Post ok" });
    },
    //AddNumberOf (pra comentarios, curtidas e reposts, aumneta em +1 ou Fazer Cada uma dessas coisas como um objeto interno que nem os comentarios e só pegar quantos tem, dai n precisa desse addNumberOf cada um)
};
