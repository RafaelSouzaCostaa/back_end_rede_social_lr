const Post = require("../model/Post");
const SubComment = require("../model/SubComment");

module.exports = {
    createSubComment: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         * #swagger.summary = 'Criando um SubComment'
             #swagger.parameters['SubComment'] = { 
                in: 'body', 
                description: 'Esse obj add um SubComment no banco de dados', 
                required: true, 
                schema: { 
                    commentObjectId: "63703f1de318f3ffa792dde4",
                    profileObjectId: "63703f1de318f3ffa79sdse5",
                    comment: "Este e um SubComment" ,
                    numberOfLikes: 0,
                } 
            }
         */

        //IMPLEMENTAR verificar se commentObjectId existe ( post que esta sendo comentado )
        try {
            let newSubComment = SubComment(req.body);
            let existingPost = await Post.findOne({
                "comments._id": newSubComment.commentObjectId,
            });

            existingPost.comments
                .id(newSubComment.commentObjectId)
                .subComments.push(newSubComment);

            existingPost.comments.id(
                newSubComment.commentObjectId
            ).numberOfComments = existingPost.comments.id(
                newSubComment.commentObjectId
            ).subComments.length;

            let newPost = await Post.findByIdAndUpdate(
                existingPost._id,
                existingPost
            );

            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json({ error });
        }
    },
};
//GetAllCommmentsOfOneUser
