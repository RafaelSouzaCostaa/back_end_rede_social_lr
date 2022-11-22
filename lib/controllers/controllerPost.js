const { json } = require("express");
const Post = require("../model/Post");
const Profile = require("../model/Profile");

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
                    postDate: "6454654165146",
                    description: "descrição aqui"
                } 
            }
         */

        try {
            //IMPLEMENTAR verificar se profileObjectId existe ( quem esta postando )
            //RAFAEL validar se foi passado algum link de foto e descrição
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
            #swagger.summary = 'getAll'
        */
        try {
            var post = await Post.find({ profileObjectID: req._idToken });

            if (post != null) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ msg: "No post found" });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getAllByFollow: async function (req, res, next) {
        /*  
            #swagger.tags = ['Post']
            #swagger.summary = 'getAllByFollow'
        */
        try {
            var id = req._idToken;
            var postsFollow = [];
            var profile = await Profile.findById(id);
            var idsFollow = profile.followersObjectId;

            if (profile != null) {
                for (let i = 0; i < idsFollow.length; i++) {
                    var posts = await Post.find({
                        profileObjectID: idsFollow[i]._id,
                    });
                    if (posts != null) {
                        for (let is = 0; is < posts.length; is++) {
                            postsFollow.push(posts[is]);
                        }
                    }
                }
                res.status(200).json(postsFollow);
            } else {
                res.status(404).json({ msg: "Posts não encontrado!" });
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
        */
        let profileId = req.params;
        try {
            var posts = await Post.find({profileObjectId: profileId});
            if (posts.length == 0) {
                res.status(404).json({ msg: "Post ou Perfil não encontrado!" });
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
        */
        const _id = req.params;
        try {
            var post = await Post.deleteOne(_id);
            post.deletedCount == 0
                ? res.status(404).json({ msg: "Postagem não encontrada!" })
                : res
                      .status(200)
                      .json({ msg: "Postagem deletada com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    //AddNumberOf (pra comentarios, curtidas e reposts, aumneta em +1 ou Fazer Cada uma dessas coisas como um objeto interno que nem os comentarios e só pegar quantos tem, dai n precisa desse addNumberOf cada um)
};
