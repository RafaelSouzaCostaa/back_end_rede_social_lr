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

            let newComment = Comment(req.body);
            let profile = await Profile.findById(
                req.params.profileObjectIdPost
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

            profile.save();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ error });
        }
    },

    //TESTADO
    deleteByID: async function (req, res, next) {
        /*
         * #swagger.tags = ["Comment"]
            #swagger.summary = 'Remove o Comentario especificado pelo ID'
         */
        try {
            let profile = await Profile.findById(
                req.params.profileObjectIdPost
            );

            if (!profile) {
                res.status(404).json({ msg: "Profile não encontrado" });
            }

            const _id = req.params.commentObjectID;
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
                profile.save();
                res.status(200).json(profile);
            } else {
                res.status(404).json({ msg: "Commentario não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
};
//DeleteSubComment
