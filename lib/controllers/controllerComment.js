const Comment = require("../model/Comment");
const Post = require("../model/Post");

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
                    postObjectId: "63703f1de318f3ffa792dde4",
                    creationDate: "56115615516",
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

            let post = await Post.findById(newComment.postObjectId);

            if(post){
                post.comments.push(newComment);

                post.numberOfComments = post.comments.length;
    
                let newPost = await Post.findByIdAndUpdate(post._id,post);
                res.status(200).json(newPost);
            }else{
                res.status(404).json({msg: "Postagem não encontrada"});
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    deleteByID: async function (req, res, next) {
        //RAFAEL coloca o negocio do swagger aqui
        /*
         * #swagger.tags = ["Comment"]
            #swagger.summary = 'Remove o Comentario especificado pelo ID'
         */
        
        try {
            let comment = await Comment.findById(req.params);

            if(comment != null){
                await Comment.findOneAndDelete({_id:req.params});
                res.status(200).json({msg:"Comentario removido com sucesso"});
                return;
            }else{
                res.status(404).json({msg: "Comentario não encontrado"});
            }
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
};
//DeleteSubComment
