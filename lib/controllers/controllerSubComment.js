const Post = require("../model/Post");
const SubComment = require("../model/SubComment");
const Profile = require("../model/Profile");

module.exports = {
    createSubComment: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         * #swagger.summary = 'Adiciona um Sub Comentario'
             #swagger.parameters['SubComment'] = { 
                in: 'body', 
                description: 'Adiciona um Sub Comentario a um Comentario no banco de dados', 
                required: true, 
                schema: { 
                    commentObjectId: "63703f1de318f3ffa792dde4",
                    creationDate: "561561516561",
                    comment: "Este e um SubComment" ,
                } 
            }
         */

        try {
            req.body.creationDate = parseInt(req.body.creationDate);
            req.body.profileObjectId = req._idToken;

            let newSubComment = SubComment(req.body);
            let profile = await Profile.findById(
                req.params.profileObjectIdPost
            );
            if (!profile) {
                res.status(404).json({ msg: "Perfil não encontrado" });
                return;
            }
            profile.posts.forEach((post) => {
                if (post.comments.id(req.body.commentObjectId)) {
                    let length = post.comments
                        .id(req.body.commentObjectId)
                        .subComments.push(newSubComment);

                    post.comments.id(
                        req.body.commentObjectId
                    ).numberOfComments = length;
                    return;
                }
            });
            await profile.save();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteSubComment: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         * #swagger.summary = 'Remove o Sub Comentario especificado pela ID'
         */
        try {
            let profile = await Profile.findById(
                req.params.profileObjectIdPost
            );
            if (!profile) {
                res.status(404).json({ msg: "Perfil não encontrado" });
                return;
            }

            profile.posts.forEach((post) => {
                if (post.comments.id(req.params.commentObjectID)) {
                    if (
                        post.comments.id(req.params.commentObjectID).subComments
                    ) {
                        post.comments
                            .id(req.params.commentObjectID)
                            .subComments.pull(req.params.subCommentObjectID);
                        post.comments.id(
                            req.params.commentObjectID
                        ).numberOfComments = post.comments.id(
                            req.params.commentObjectID
                        ).subComments.length;
                        return;
                    }
                }
            });
            await profile.save();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
//GetAllCommmentsOfOneUser
