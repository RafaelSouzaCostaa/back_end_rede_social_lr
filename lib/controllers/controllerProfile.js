const Profile = require("../model/Profile");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "variables.env" });

module.exports = {
    create: async function (req, res, next) {
        /*  
            #swagger.tags = ['Profile']
            #swagger.summary = 'Criando um Profile'
         * #swagger.security = []
             #swagger.parameters['Profile'] = { 
                in: 'body', 
                description: 'Esse obj add um profile no banco de dados; //IMPLEMENTAR uma descrição que não sangre os olhos de quem vê!', 
                required: true,
                schema: { 
                    name: "Rafael De Souza", 
                    nickname: "leafar",
                    email: "leafar@leafar",
                    password: "password321",
                    creationDate: "515656151"
                } 
            }
            #swagger.responses[404] = {
                description: "Email ou NickName já está em uso!"
            }
        */

        let reqProfile = req.body;
        reqProfile.creationDate = parseInt(reqProfile.creationDate);
        reqProfile.password = await bcrypt.hash(
            reqProfile.password,
            parseInt(process.env.SALT)
        );

        try {
            let resProfile = await Profile.create(Profile(reqProfile));

            resProfile.password = undefined;
            res.status(200).json(resProfile); //ATENCAO RETORNAR UMA MSG OU NADA FUTURAMENTE - TESTE
            return;
        } catch (error) {
            if (error.code == 11000) {
                res.status(404).json({
                    msg: "Email/NickName já em uso! Tente outro!",
                });
            } else {
                res.status(500).json({ msg: error });
            }
        }
    },
    getAll: async function (req, res, next) {
        //rota inutil
        /*
            #swagger.tags = ['Profile']
            #swagger.summary = 'Buscando todos os Profiles'
            #swagger.responses[404] = {
                description: "Não tem profiles cadastrado no banco!",
            }
        */

        try {
            var profiles = await Profile.find();
            if (profiles.length == 0) {
                res.status(404).json({ msg: "Profiles não encontrados!" });
            } else {
                res.status(200).json(profiles);
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },
    getByNickname: async function (req, res, next) {
        /*  
            #swagger.tags = ['Profile']
            #swagger.summary = 'Buscando profile por nickname'
            #swagger.parameters['nickname'] = {nickname: 'nickname'}
            #swagger.responses[404] = {
                description: "Profile não encontrado!",
            }
        */
        const nickname = req.params;
        try {
            var profile = await Profile.findOne(nickname, {
                password: 0,
            });

            if (profile.length == 0) {
                res.status(404).json({ msg: "Profile não encontrado!" });
            } else {
                res.status(200).json(profile);
            }
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    getById: async function (req, res, next) {
        /*  
            #swagger.tags = ['Profile']
            #swagger.summary = 'Buscando profile por ID'
        */
        const _id = req.params;
        try {
            var profile = await Profile.findById(_id, {
                password: 0,
            });
            profile == null
                ? res.status(404).json({ msg: "Profile não encontrado!" })
                : res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    getProfileByToken: async function (req, res, next) {
        /**
            #swagger.tags = ['Profile']
         */
        let idToken = req._idToken;

        try {
            var profile = await Profile.findById(idToken, {
                password: 0,
            });

            profile == null
                ? res.status(404).json({ msg: "Profile não encontrado!" })
                : res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
    followById: async function (req, res, next) {
        /**
         * #swagger.tags = ['Profile']
         #swagger.summary = 'follow'
         */
        try {
            let followObjectId = req.params.followObjectId;
            let idToken = req._idToken;
            if (followObjectId != idToken) {
                let followProfile = await Profile.findOne({
                    _id: followObjectId,
                });
                let profileToken = await Profile.findOne({
                    _id: idToken,
                });

                if (!followProfile || !profileToken) {
                    res.status(404).json({ error: "Profile not found!" });
                    return;
                }

                profileToken.followersObjectId.push(followProfile);
                followProfile.followingObjectId.push(idToken);

                profileToken.save();
                followProfile.save();

                res.status(200).json();
                return;
            }
            res.status(404).json({ msg: "Voce não pode se seguir!" });
        } catch (error) {
            res.status(500).json({ error });
        }

        res.status(200).json();
    },
    //RAFAEL testar essa rota
    unfollowById: async function (req, res, next) {
        /**
         * #swagger.tags = ['Profile']
         #swagger.summary = 'unfollow'
         */
        try {
            let unfollowObjectId = req.params.followObjectId;
            let idToken = req._idToken;
            if (unfollowObjectId != idToken) {
                let unfollowProfile = await Profile.findOne({
                    _id: unfollowObjectId,
                });
                let profileToken = await Profile.findOne({
                    _id: idToken,
                });

                if (!unfollowProfile || !profileToken) {
                    res.status(404).json({ error: "Perfil não encontrado!" });
                    return;
                }

                profileToken.followersObjectId.pop(unfollowProfile);
                unfollowProfile.followingObjectId.pop(idToken);

                profileToken.save();
                unfollowProfile.save();

                res.status(200).json();
                return;
            }
            //RAFAEL arruma uma mensagem melhor pra por aqui
            res.status(404).json({ msg: "Voce não pode se livrar de si mesmo :)" });
        } catch (error) {
            res.status(500).json({ error });
        }

        res.status(200).json();
    },
    deleteByID: async function (req, res, next) {
        /**
         * #swagger.tags = ['Profile']
         #swagger.summary = 'Deletar profile por ID'
         #swagger.responses[404] = {
                description: "Profile não encontrado!",
            }
         */
        const _id = req.params;
        try {
            //RAFAEL salvar os dados deletados em outra colection
            var profile = await Profile.deleteOne(_id);
            profile.deletedCount == 0
                ? res.status(404).json({ msg: "Profile não encontrado!" })
                : res
                      .status(200)
                      .json({ msg: "Profile deletado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },

    //IMPLEMENTAR
    //(Se der fazer tudo na mesma rota, só verificando qual info veio e usar ela, se n faz separado mesmo)
    //>ChangeNickname
    //ChangePassword
    //ChangeName
    //ChangeEmail
    //ChangeProfilePicture
    //>ChangeBackgroundImage (Ma criação passar uma bgImage generica pro usuario colocar depois quando ele tiver modificando o perfil)
    //>add ou changePhoneNumber (O Numero de celular não mais vai ser passado na criação, vai ser adicionado depois, mas o usuario, caso ja tenha adicionado, ainda consegue fazer login com ele)
    //
};
