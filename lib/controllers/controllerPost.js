const Post = require("../model/Post");
const Profile = require("../model/Profile");

module.exports = {
    create: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Cria uma nova Postagem'
             #swagger.parameters['Post'] = { 
                in: 'body', 
                description: 'Adiciona uma postagem ao banco de dados', 
                required: true, 
                schema: { 
                    postMedia: [
                        "https://images.pexels.com/photos/1000739/pexels-photo-1000739.jpeg",
                        "https://images.pexels.com/photos/6964129/pexels-photo-6964129.jpeg"
                    ],
                    postDate: "6454654165146",
                    description: "descrição aqui"
                } 
            }
         */

        try {
            //TESTADO

            //ATENCAO AQUI FOI EDITADO - MOTIVO: ADD POST EM PROFILE

            let id = req._idToken;

            let profile = await Profile.findById(id);
            console.log(profile);
            if (!profile) {
                res.status(404).json({ msg: "Nenhum profile encontrado" });
            }

            req.body.postDate = parseInt(req.body.postDate);
            profile.posts.push(Post(req.body));

            profile.save();

            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getAll: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
            #swagger.summary = 'Recupera todos as Postagens'
        */
        try {
            //TESTADO
            var profile = await Profile.findById(req._idToken);

            if (!profile) {
                res.status(404).json({ msg: "Nenhum profile encontrado" });
            }

            if (!profile.posts.length > 0) {
                res.status(404).json({ msg: "Nenhuma postagem encontrada" });
            }

            var posts = profile.posts;

            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getAllByFollow: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
            #swagger.summary = 'Recupera todas as Postagens dos Perfis que o Perfil logado atual segue'
        */
        //IMPLEMENTAR //RAFAEL Deixei para depois pois e uma implementação mais aprofundada
        //Aqui tem que retornar o profile todo, ou fazer uma forma de injetar o nome no post, se for tetornar todos os profile, trocar rota de local
        try {
            var id = req._idToken;
            var postsFollow = [];
            var profile = await Profile.findById(id);
            var idsFollow = profile.followersObjectId;

            if (profile != null) {
                for (let i = 0; i < idsFollow.length; i++) {
                    var profile = await Profile.findById(idsFollow[i]._id);
                    if (!profile) {
                        continue;
                    }
                    var posts = profile.posts;

                    postsFollow = postsFollow.concat(posts);
                    console.log(postsFollow);
                }
                res.status(200).json(postsFollow);
            } else {
                res.status(404).json({ msg: "Postagem não encontrada" });
                return;
            }
        } catch (error) {
            res.status(500).json(error);
            return;
        }
    },
    getAllByProfileId: async function (req, res, next) {
        //RAFAEL coloca o negocio do swagger aqui
        /*
         * #swagger.tags = ["Post"]
            #swagger.summary = 'Recupera todas as Postagens do Perfil especificado pelo ID, caso passar uma ID vazia retorna as Postagens do Perfil atual'
         */
        let idToken = req._idToken;
        let profileId = req.params;

        let id;
        if (profileId._id != "null") {
            id = profileId._id;
        } else {
            id = idToken;
        }
        try {
            var posts = await Post.find({ profileObjectId: id });
            if (posts.length == 0) {
                res.status(404).json({
                    msg: "Postagem ou Perfil não encontrados",
                });
            } else {
                res.status(200).json(posts);
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },
    deleteByID: async function (req, res, next) {
        //RAFAEL coloca o negocio do swagger aqui
        /*
         * #swagger.tags = ["Post"]
            #swagger.summary = 'Remove a Postagem especificada pelo ID'
         */
        const _id = req.params;
        try {
            var post = await Post.deleteOne(_id);
            post.deletedCount == 0
                ? res.status(404).json({ msg: "Postagem não encontrada" })
                : res
                      .status(200)
                      .json({ msg: "Postagem deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    //AddNumberOf (pra comentarios, curtidas e reposts, aumneta em +1 ou Fazer Cada uma dessas coisas como um objeto interno que nem os comentarios e só pegar quantos tem, dai n precisa desse addNumberOf cada um)
};
