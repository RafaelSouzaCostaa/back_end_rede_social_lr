const Comment = require("../model/Comment");
const Post = require("../model/Post");

module.exports = {
    createComment: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         * #swagger.summary = 'Criando um Comment'
             #swagger.parameters['Comment'] = { 
                in: 'body', 
                description: 'Esse obj add um comment no banco de dados', 
                required: true, 
                schema: { 
                    postObjectId: "63703f1de318f3ffa792dde4",
                    profileObjectId: "63703f1de318f3ffa792ddad", 
                    comment: "Este e um comentario" ,
                    numberOfLikes: 0,
                    numberOfComments: 0,
                    subComments: []
                } 
            }
         */

        //IMPLEMENTAR verificar se postObjectId existe ( post que esta sendo comentado )
        try {
            let newComment = Comment(req.body);

            let existingPost = await Post.findById(newComment.postObjectId);

            existingPost.comments.push(newComment);

            existingPost.numberOfComments = existingPost.comments.length;

            let savePost = await Post.replaceOne(
                { _id: existingPost._id },
                existingPost
            );

            res.status(200).json(existingPost);
        } catch (error) {
            res.status(500).json({ error });
        }
    },
};
//GetAllCommmentsOfOneUser
//DeleteComment
//DeleteSubComment
