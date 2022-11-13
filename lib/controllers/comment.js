const Comment = require("../model/Comment");
const SubComment = require("../model/SubComment");

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
                    profileObjectId: "63703f1de318f3ffa792dde4", 
                    comment: "Este e um comentario" ,
                    numberOfLikes: 58,
                    numberOfComments: 0,
                    comments: [{
                        commentProfileObjectId: "63703f1de318f3ffa792dde6" ,
                        comment: "Este e um comentario" ,
                        numberOfLikes: 12
                    }]
                } 
            }
         */
        const {
            profileObjectId,
            comment,
            numberOfLikes,
            numberOfComments,
            comments,
        } = req.body;

        const objComment = {
            profileObjectId,
            comment,
            numberOfLikes,
            numberOfComments,
            comments,
        };
        //IMPLEMENTAR VALIDAR SE POSSUI O ID PASSADO, OU PASSA POR TOKEN E NAO PRECOSA IMPLEMENTAR
        try {
            var resComment = await Comment.create(objComment);

            res.status(200).json(resComment);
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    getCommentByID: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         *  #swagger.summary = 'Buscando um comment por ID'
         */

        const _id = req.params;

        try {
            var resComment = await Comment.findById(_id);

            if (resComment != null) {
                res.status(200).json(resComment);
            } else {
                res.status(404).json({ msg: "Comment não encontrado!" });
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    getAllSubCommentCommentById: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         *  #swagger.summary = 'Buscando todos os subComment por ID de comment'
         */

        const _id = req.params;

        try {
            var resComment = await Comment.findById(_id);

            if (resComment != null) {
                res.status(200).json(resComment.comments);
            } else {
                res.status(404).json({ msg: "Comment não encontrado!" });
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    addSubComment: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         *  #swagger.summary = 'Add um SubComment pelo ID de Comment'
         * #swagger.parameters['Comment'] = { 
                in: 'body', 
                description: 'Esse obj add um SubComment no Comment por ID', 
                required: true, 
                schema: { 
                    profileObjectId: "63703f1de318f3ffa792dde4", 
                    comment: "Este e um SubComentario" ,
                    numberOfLikes: 15
                } 
            }
            #swagger.parameters['_id'] = { 
                in: 'path', 
                description: 'ID de um Comment', 
                required: true, 
            }
         */

        const _id = req.params;

        try {
            var resComment = await Comment.findById(_id);

            resComment.comments.push(SubComment(req.body));

            let upgradeComment = await Comment.replaceOne(
                { _id: _id },
                resComment
            );

            if (upgradeComment.modifiedCount == 0) {
                res.status(404).json({ msg: "SubComment não adicionado!" });
            } else {
                res.status(200).json(resComment);
            }
        } catch (error) {
            let msg;
            let statusCode = 500;
            if (resComment == null) {
                msg = "ID do Comment não encontrado!";
                statusCode = 404;
            }
            res.status(statusCode).json({ specificError: msg, error });
        }
    },
    deleteSubCommentByIDs: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         *  #swagger.summary = 'Deletar um SubComment de um Comment'
         * 
            #swagger.parameters['_idComment'] = { 
                in: 'path', 
                description: 'ID de um Comment', 
                required: true, 
            },
            #swagger.parameters['_idSubComment'] = { 
                in: 'path', 
                description: 'ID de um SubComment', 
                required: true, 
            }
         */
        const { _idComment, _idSubComment } = req.params;

        console.log(
            "_idComment: " + _idComment + ", _idSubComment: " + _idSubComment
        );

        try {
            let comment = await Comment.findById({ _id: _idComment });

            comment.comments.id(_idSubComment).remove();

            let upgradeComment = await Comment.replaceOne(
                { _id: comment._id },
                comment
            );

            res.status(200).json({ upgradeComment, comment });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deletarCommentByID: async function (req, res, next) {
        /**
         * #swagger.tags = ["Comment"]
         *  #swagger.summary = 'Deletar um SubComment de um Comment'
         * 
            #swagger.parameters['_id'] = { 
                in: 'path', 
                description: 'ID de um Comment', 
                required: true, 
            }d: true, 
            }
         */

        try {
            let comment = await Comment.findByIdAndDelete(req.params);

            res.status(200).json({ comment });
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
//GetAllCommmentsOfOneUser
//DeleteComment
//DeleteSubComment
