const Post = require("../model/Post");
const Profile = require("../model/Profile");

module.exports = {
    create: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Adiciona uma nova Publicação ao Banco de Dados'
             #swagger.parameters['Post'] = { 
                in: 'body', 
                description: 'Adiciona uma Publicação ao banco de dados', 
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
            const id = req._idToken;

            let profile = await Profile.findById(id);
            if (!profile) {
                res.status(404).json({ msg: "Nenhum Perfil encontrado" });
            }

            req.body.postDate = parseInt(req.body.postDate);
            req.body.profileObjectId = id;

            profile.posts.unshift(Post(req.body));
            await profile.save();

            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
            #swagger.summary = 'Recupera todos as Publicações'
        */
        try {
            var profile = await Profile.findById(req._idToken);

            if (!profile) {
                res.status(404).json({ msg: "Nenhum Perfil encontrado" });
            }

            if (!profile.posts.length > 0) {
                res.status(404).json({ msg: "Nenhuma Publicação encontrada" });
            }

            res.status(200).json(profile.posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllByFollow: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
            #swagger.summary = 'Recupera todas as Publicações dos Perfis que o Perfil logado atual segue'
        */
        try {
            const id = req._idToken;
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
                        element.name = profile.name;
                        element.profileObjectId = profile._id;
                        element.nickname = profile.nickname;
                        element.image = profile.image;
                    });

                    postsFollow = postsFollow.concat(posts);
                }
                res.status(200).json(postsFollow);
            } else {
                res.status(404).json({ msg: "Publicação não encontrada" });
                return;
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllByProfileId: async function (req, res, next) {
        /*
         * #swagger.tags = ["Post"]
            #swagger.summary = 'Recupera todas as Publicações do Perfil especificado pelo ID'
         */
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
                //LUIGGI conseguimos injetar o link de profile atualizado aqui, como fiz nameProfile e
                //profileObjectId, mesmo se o profile mudar ele fai pega o atual
                element.name = profile.name;
                element.profileObjectId = profile._id;
                element.nickname = profile.nickname;
                element.image = profile.image;
            });
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    like: async function (req, res, next) {
        /**
         * #swagger.tags = ["Post"]
         * #swagger.summary = 'Adiciona ou Remove uma Curtida da Publicação indicada'
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
        const profileObjectId = req.body.profileObjectId;
        const postId = req.body.postObjectId;

        let msg = "Curtiu";
        let post = {
            profileObjectId: profileObjectId,
            postObjectId: postId,
        };

        try {
            let profile = await Profile.findById(_idToken);
            let profilePostOwner = await Profile.findById(profileObjectId);

            if (!profile || !profilePostOwner) {
                res.status(404).json({ msg: "Perfil não encontrado" });
            }

            let liked = true;
            profile.likedPosts.forEach((likedPost) => {
                if (likedPost.postObjectId == postId) {
                    liked = false;
                    msg = "Descurtiu";
                    return;
                }
            });

            if (liked) {
                profile.likedPosts.push(post);
                profilePostOwner.posts.id(postId).likes.push(_idToken);
                profilePostOwner.posts.id(postId).numberOfLikes += 1;
            } else {
                if (_idToken == profileObjectId) {
                    profilePostOwner.likedPosts =
                        profilePostOwner.likedPosts.filter((post) => {
                            return post.postObjectId != postId;
                        });
                    profilePostOwner.posts.id(postId).likes.pull(_idToken);
                    profilePostOwner.posts.id(postId).numberOfLikes -= 1;
                } else {
                    profile.likedPosts = profile.likedPosts.filter((post) => {
                        return post.postObjectId != postId;
                    });
                    profilePostOwner.posts.id(postId).likes.pull(_idToken);
                    profilePostOwner.posts.id(postId).numberOfLikes -= 1;
                }
            }

            let likedPost = profilePostOwner.posts.id(postId);
            await profilePostOwner.save();
            await profile.save();

            res.status(200).json({
                msg: msg,
                likedPost: likedPost,
            });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    deleteByID: async function (req, res, next) {
        /*
         * #swagger.tags = ["Post"]
            #swagger.summary = 'Remove a Publicação especificada pelo ID'
         */
        try {
            const _id = req._idToken;
            const _idPost = req.params._idPost;
            var profile = await Profile.findById(_id);

            if (!profile) {
                res.status(404).json({ msg: "Perfil não encontrado" });
            }

            profile.posts.pull(_idPost);

            await profile.save();
            res.status(200).json({});
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};
