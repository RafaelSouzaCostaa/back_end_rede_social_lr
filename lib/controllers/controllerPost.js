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
            let id = req._idToken;

            let profile = await Profile.findById(id);

            if (!profile) {
                res.status(404).json({ msg: "Nenhum Perfil encontrado" });
            }

            req.body.postDate = parseInt(req.body.postDate);
            req.body.profileObjectId = id;

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

            res.status(200).json(profile.posts);
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
            var idsFollow = profile.followingObjectId;

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
                        element.image = profile.image;
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
        //TESTAR
        let id = req.params._id;

        if (id == "null") {
            id = req._idToken;
        }

        try {
            var profile = await Profile.findById(id);
            if (!profile) {
                res.status(404).json({
                    msg: "Perfil não encontrado",
                });
            }
            var posts = profile.posts;
            posts.forEach((element) => {
                //LUIGGI conseguimos injetar o link de profile atualizado aqui, como fiz nameProfile e profileObjectId, mesmo se o profile mudar ele fai pega o atual
                element.name = profile.name;
                element.profileObjectId = profile._id;
                element.nickname = profile.nickname;
                element.image = profile.image;
            });
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    addLike: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Adiciona uma curitda á Postagem indicada'
             #swagger.parameters['Post'] = { 
                in: 'body', 
                required: true, 
                schema: { 
                    profileObjectId: "63703f1de318f3ffa792dde4",
                    postObjectId: "63703f1de318f3ffa792ddea"
                } 
            }
         */

        const _idToken = req._idToken;

        let post = {
            profileObjectId: req.body.profileObjectId,
            postObjectId: req.body.postObjectId,
        };
        try {
            let profileLiked = await Profile.findById(_idToken);

            if (!profileLiked) {
                res.status(404).json({
                    msg: "profile não encontrada",
                });
            }
            profileLiked.likedPosts.push(post);

            let profilePostOwner = await Profile.findById(req.body.profileObjectId);

            if (!profilePostOwner) {
                res.status(404).json({
                    msg: "profile não encontrada",
                });
            }

            let profileAlreadyLiked = false;
            profilePostOwner.posts
                .id(req.body.postObjectId)
                .postLikedBy.forEach((postLikeBy) => {
                    if (postLikeBy == _idToken) {
                        profileAlreadyLiked = true;
                        return;
                    }
                });

            if (!profileAlreadyLiked) {
                profilePostOwner.posts
                    .id(req.body.postObjectId)
                    .postLikedBy.push(_idToken);

                profilePostOwner.posts.id(req.body.postObjectId).numberOfLikes += 1;
                profilePostOwner.save();
                profileLiked.save();
                res.status(200).json();
            } else {
                res.status(404).json({
                    msg: "Profile já curtiu essa publicação!",
                });
            }
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    removeLike: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Remove curtida da Postagem indicada'
             #swagger.parameters['Post'] = { 
                in: 'body', 
                required: true, 
                schema: { 
                    profileObjectId: "63703f1de318f3ffa792dde4",
                    postObjectId: "63703f1de318f3ffa792ddea"
                } 
            }
         */

        const _idToken = req._idToken;

        try {
            let profile = await Profile.findById(_idToken);

            if (!profile) {
                res.status(404).json({msg: "Perfil não encontrada"});
            }

            profile.likedPosts = profile.likedPosts.filter((post) => {
                return post.postObjectId != req.body.postObjectId;
            });

            let profilePostOwner = await Profile.findById(req.body.profileObjectId);

            if (!profilePostOwner) {
                res.status(404).json({
                    msg: "Perfil não encontrada",
                });
            }

            profilePostOwner.posts
                .id(req.body.postObjectId)
                .postLikedBy.pull(_idToken);

            profilePostOwner.posts.id(req.body.postObjectId).numberOfLikes -= 1;
            profilePostOwner.save();
            profile.save();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    deleteByID: async function (req, res, next) {
        /*
         * #swagger.tags = ["Post"]
            #swagger.summary = 'Remove a Postagem especificada pelo ID'
         */
        try {
            var profile = await Profile.findById(req.params._idProfile);

            if (!profile) {
                res.status(404).json({ msg: "Perfil não encontrado" });
            }

            profile.posts.forEach((element, index) => {
                //ATENCAO tem uma maneira mais facil de apagar o valor aqui dentro, refatorar posteriormente, time curto.
                if (element._id == req.params._idPost) {
                    profile.posts.splice(index, 1);
                }
            });
            profile.save();
            res.status(200).json({});
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};
