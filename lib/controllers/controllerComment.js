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
                    creationDate: "MilissegundosString",
                    comment: "Este e um comentario" ,
                    numberOfLikes: 0,
                    numberOfComments: 0,
                    subComments: []
                } 
            }
         */

        //IMPLEMENTAR verificar se postObjectId existe ( post que esta sendo comentado )
        try {
            req.body.profileObjectId = req._idToken;
            req.body.creationDate = parseInt(req.body.creationDate);
            let newComment = Comment(req.body);

            let existingPost = await Post.findById(newComment.postObjectId);

            existingPost.comments.push(newComment);

            existingPost.numberOfComments = existingPost.comments.length;

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
//DeleteComment
//DeleteSubComment