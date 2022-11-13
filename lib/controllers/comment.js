const Comment = require("../model/Comment");

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
        //IMPLEMENTAR VALIDAR SE POSSUI O ID PASSADO, OU PASSA POR TOKEN E NÂO IMPLEMENTA
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
         */
        res.status(200).json({ msg: "OK" });
    },
};
