const Post = require("../model/Post");

module.exports = {
    create: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Criando um Post'
             #swagger.parameters['Post'] = { 
                in: 'body', 
                description: 'Esse obj add um comment no banco de dados', 
                required: true, 
                schema: { 
                    postMedia: [
                        "https://images.pexels.com/photos/1000739/pexels-photo-1000739.jpeg",
                        "https://images.pexels.com/photos/6964129/pexels-photo-6964129.jpeg"
                    ],
                    postDate: "MilissegundosString",
                    numberOfLikes: 0,
                    numberOfReposts: 0,
                    numberOfComments: 0,
                    comments: []
                } 
            }
         */

        try {
            //IMPLEMENTAR verificar se profileObjectId existe ( quem esta postando )
            req.body.profileObjectID = req._idToken;
            req.body.postDate = parseInt(req.body.postDate);
            let newPost = await Post.create(Post(req.body));

            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getAll: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
            #swagger.summary = 'getAllPosts'
        */
        res.status(200).json({ msg: "Busca de Post ok" });
    },
    //AddNumberOf (pra comentarios, curtidas e reposts, aumneta em +1 ou Fazer Cada uma dessas coisas como um objeto interno que nem os comentarios e só pegar quantos tem, dai n precisa desse addNumberOf cada um)
};
