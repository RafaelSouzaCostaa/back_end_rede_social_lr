const Comment = require("../model/Comment");
const Profile = require("../model/Profile");

module.exports = {
    createComment: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         * #swagger.summary = 'Cria um Comentario'
         
             #swagger.parameters['Comment'] = { 
                in: 'body', 
                description: 'Adiciona um Comentario a uma Postagem no Banco de Dados', 
                required: true, 
                schema: { 
                    profileCommentObjectID: "637aa29ad1d1462fe96331f0",
                    postObjectId: "6386de4bbbd7d1884c5aede0",
                    creationDate: "56115615516",
                    comment: "Este e um comentario" 
                } 
            }
         */
        //TESTADO
        try {
            req.body.profileObjectId = req._idToken;
            req.body.creationDate = parseInt(req.body.creationDate);
            let newComment = Comment(req.body);

            let profile = await Profile.findById(
                newComment.profileCommentObjectID
            );

            if (!profile) {
                res.status(404).json({ msg: "Profile não encontrado" });
                return;
            }

            profile.posts.forEach((post, index) => {
                if (post._id.equals(newComment.postObjectId)) {
                    profile.posts[index].comments.push(newComment);

                    profile.posts[index].numberOfComments =
                        profile.posts[index].comments.length;
                }
            });
            console.log(profile);
            profile.save();

            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    //BUG //TESTAR tudo aqui abaixo
    deleteByID: async function (req, res, next) {
        //RAFAEL coloca o negocio do swagger aqui
        /*
         * #swagger.tags = ["Comment"]
            #swagger.summary = 'Remove o Comentario especificado pelo ID'
         */

        try {
            let comment = await Comment.findById(req.params);

            if (comment != null) {
                await Comment.findOneAndDelete({ _id: req.params });
                res.status(200).json({
                    msg: "Comentario removido com sucesso",
                });
                return;
            } else {
                res.status(404).json({ msg: "Comentario não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
};
//DeleteSubComment
