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
                    creationDate: "561561516561",
                    comment: "Este e um SubComment" ,
                } 
            }
         */
        try {
            req.body.profileObjectId = req._idToken;
            req.body.creationDate = parseInt(req.body.creationDate);

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

            var teste = SubComment.create(newSubComment);

            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },
};
//GetAllCommmentsOfOneUser
