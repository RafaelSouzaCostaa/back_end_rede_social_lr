const Comment = require("../model/Comment");
const Profile = require("../model/Profile");

module.exports = {
    createComment: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         * #swagger.summary = 'Cria um Comentario'
         
             #swagger.parameters['Comment'] = { 
                in: 'body', 
                description: 'Adiciona um Comentario em uma Publicação do Banco de Dados', 
                required: true, 
                schema: { 
                    postObjectId: "6386de4bbbd7d1884c5aede0",
                    creationDate: "56115615516",
                    comment: "Este e um comentario" 
                } 
            }
         */
        //TESTADO
        try {
            req.body.creationDate = parseInt(req.body.creationDate);
            req.body.profileObjectId = req._idToken;
            let resComment;
            let newComment = Comment(req.body);

            let profile = await Profile.findById(req.params.profileObjectId);
            if (!profile) {
                res.status(404).json({ msg: "Perfil não encontrado" });
                return;
            }
            profile.posts.forEach((post, index) => {
                if (post._id.equals(newComment.postObjectId)) {
                    profile.posts[index].comments.push(newComment);
                    profile.posts[index].numberOfComments =
                        profile.posts[index].comments.length;
                    resComment = profile.posts[index].comments[0];
                    return;
                }
            });

            await profile.save();
            res.status(200).json(resComment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    //TESTADO
    deleteByID: async function (req, res, next) {
        /*
         * #swagger.tags = ["Comment"]
            #swagger.summary = 'Remove o Comentario especificado pelo ID'
         */
        try {
            const _id = req.params.commentObjectID;

            let profile = await Profile.findById(req.params.profileObjectId);
            if (!profile) {
                res.status(404).json({ msg: "Perfil não encontrado" });
            }

            let commentDeleted = false;
            profile.posts.forEach((post) => {
                let auxLength = post.comments.length;
                post.comments.pull(_id);
                if (post.comments.length != auxLength) {
                    post.numberOfComments = post.comments.length;
                    commentDeleted = true;
                    return;
                }
            });

            if (commentDeleted) {
                await profile.save();
                res.status(200).json();
            } else {
                res.status(404).json({ msg: "Comentario não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
//DeleteSubComment
