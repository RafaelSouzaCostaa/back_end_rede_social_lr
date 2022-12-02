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
        //TESTADO
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
                    posts.forEach((element) => {
                        //LUIGGI conseguimos injetar o link de profile atualizado aqui, como fiz nameProfile e profileObjectId, mesmo se o profile mudar ele fai pega o atual
                        element.name = profile.name;
                        element.profileObjectId = profile._id;
                        element.nickname = profile.nickname;
                    });

                    postsFollow = postsFollow.concat(posts);
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
        /*
         * #swagger.tags = ["Post"]
            #swagger.summary = 'Recupera todas as Postagens do Perfil especificado pelo ID'
         */
        //TESTADO
        let id = req.params;

        try {
            var profile = await Profile.findById(id);
            if (!profile) {
                res.status(404).json({
                    msg: "Perfil não encontrado",
                });
            }

            res.status(200).json(profile.posts);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },
    deleteByID: async function (req, res, next) {
        /*
         * #swagger.tags = ["Post"]
            #swagger.summary = 'Remove a Postagem especificada pelo ID'
    

         */
        //TESTADO
        try {
            var profile = await Profile.findById(req.params._idProfile);

            if (!profile) {
                res.status(404).json({ msg: "profile não encontrada" });
            }

            profile.posts.forEach((element, index) => {
                //ATENCAO tem uma maneira mais facil de apagar o valor aqui dentro, refatorar posteriormente, time curto.
                if (element._id == req.params._idPost) {
                    profile.posts.splice(index, 1);
                }
            });
            profile.save();
            res.status(200).json({ msg: "Postagem deletada com sucesso" });
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    setPostLike: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Salva um post curtido'
             #swagger.parameters['Post'] = { 
                in: 'body', 
                required: true, 
                schema: { 
                    profileObjectId: "63703f1de318f3ffa792dde4",
                    postObjectId: "63703f1de318f3ffa792ddea"
                } 
            }
         */
        //TESTADO

        const _idToken = req._idToken;

        let post = {
            profileObjectId: req.body.profileObjectId,
            postObjectId: req.body.postObjectId,
        };
        try {
            let profile = await Profile.findById(_idToken);

            if (!profile) {
                res.status(404).json({
                    msg: "profile não encontrada",
                });
            }

            profile.postsLike.push(post);

            profile.save();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    removePostLike: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Remove um post curtido'
             #swagger.parameters['Post'] = { 
                in: 'body', 
                required: true, 
                schema: { 
                    postObjectId: "63703f1de318f3ffa792ddea"
                } 
            }
         */
        //TESTADO

        const _idToken = req._idToken;

        try {
            let profile = await Profile.findById(_idToken);

            if (!profile) {
                res.status(404).json({
                    msg: "profile não encontrada",
                });
            }

            profile.postsLike = profile.postsLike.filter((post) => {
                return post.postObjectId != req.body.postObjectId;
            });
            profile.save();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    //AddNumberOf (pra comentarios, curtidas e reposts, aumneta em +1 ou Fazer Cada uma dessas coisas como um objeto interno que nem os comentarios e só pegar quantos tem, dai n precisa desse addNumberOf cada um)
};
