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
                description: 'Adiciona um novo perfil ao banco de dados', 
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
                description: "Email ou Nickname já estão em uso"
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
            res.status(200).json(resProfile);
            return;
        } catch (error) {
            if (error.code == 11000) {
                res.status(409).json({
                    msg: "Email/NickName já em uso! Tente outro!",
                });
            } else {
                res.status(500).json({ msg: error.message });
            }
        }
    },

    followById: async function (req, res, next) {
        /**
         * #swagger.tags = ['Profile']
            #swagger.summary = 'Segue o Perfil especificado pelo ID'
         
         */

        try {
            let followObjectId = req.params.followObjectId;
            let idToken = req._idToken;
            let msgRes = "";
            let followProfile;
            let profileToken;

            if (followObjectId != idToken) {
                followProfile = await Profile.findOne({
                    _id: followObjectId,
                });
                profileToken = await Profile.findOne({
                    _id: idToken,
                });

                if (!followProfile || !profileToken) {
                    res.status(404).json({ error: "Perfil não encontrado" });
                    return;
                }
                let isRemovedFollow = false;
                profileToken.followingObjectId.forEach((_idProfile, index) => {
                    if (_idProfile._id == followObjectId) {
                        profileToken.followingObjectId.splice(index, 1);
                        followProfile.followersObjectId.forEach((id, index) => {
                            if (id._id == idToken) {
                                followProfile.followersObjectId.splice(
                                    index,
                                    1
                                );
                            }
                        });
                        isRemovedFollow = true;
                        msgRes = "removido";
                    }
                });
                if (!isRemovedFollow) {
                    followProfile.followersObjectId.push(idToken);
                    profileToken.followingObjectId.push(followProfile);
                    msgRes = "seguindo";
                }

                profileToken.save();
                followProfile.save();
            } else {
                res.status(404).json({ msg: "Voce não pode se seguir!" });
                return;
            }
            res.status(200).json({
                msg: msgRes,
                profileToken: profileToken,
                followProfile: followProfile,
            });
            return;
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAll: async function (req, res, next) {
        /*
            #swagger.tags = ['Profile']
            #swagger.summary = 'Recupera todos os Perfis do Banco de Dados'
            #swagger.responses[404] = {
                description: "Nenhum perfil encontrado no banco de dados",
            }
        */

        try {
            var profiles = await Profile.find();
            if (profiles.length == 0) {
                res.status(404).json({ msg: "Nenhum perfil encontrado" });
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
            #swagger.summary = 'Recupera Perfil especificado pelo Nickname'
            #swagger.parameters['nickname'] = {nickname: 'nickname'}
            #swagger.responses[404] = {
                description: "Perfil não encontrado",
            }
        */
        let nickname = req.params.nickname;
        try {
            var profile = await Profile.findOne({ nickname: nickname });
            if (profile) {
                res.status(200).json(profile);
            } else {
                res.status(404).json({ msg: "Perfil não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    getById: async function (req, res, next) {
        /*  
            #swagger.tags = ['Profile']
            #swagger.summary = 'Recupera Perfil especificado pelo ID'
        */
        const _id = req.params;
        try {
            var profile = await Profile.findById(_id);

            profile == null
                ? res.status(404).json({ msg: "Perfil não encontrado!" })
                : res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    getProfileByToken: async function (req, res, next) {
        /**
            #swagger.tags = ['Profile']
            #swagger.summary = 'Recupera Perfil especificado pelo Token'
         */
        let idToken = req._idToken;

        try {
            var profile = await Profile.findById(idToken, {
                password: 0,
            });

            profile == null
                ? res.status(404).json({ msg: "Perfil não encontrado!" })
                : res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    updateByToken: async function (req, res, next) {
        /*
            #swagger.tags = ['Profile']
            #swagger.summary = 'Atualiza um Profile'
            #swagger.responses[404] = {
                description: "Nenhum Perfil encontrado no banco de dados",
            }
            #swagger.parameters['Profile'] = { 
                in: 'body', 
                description: 'Atualiza um Perfil do banco de dados', 
                required: true,
                schema: { 
                    name: "Rafael De Souza", 
                    nickname: "leafar",
                    email: "leafar@leafar",
                    description: "description",
                    birthDate: "556565665465",
                } 
            }
        */
        try {
            const _id = req._idToken;

            const updateProfile = Profile(req.body);

            let profile = await Profile.findByIdAndUpdate(_id, {
                $set: {
                    name: updateProfile.name,
                    nickname: updateProfile.nickname,
                    description: updateProfile.description,
                    email: updateProfile.email,
                    birthDate: updateProfile.birthDate,
                },
            });

            if (!profile) {
                res.status(404).json({ msg: "Profile not found" });
                return;
            }
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteByID: async function (req, res, next) {
        /**
         * #swagger.tags = ['Profile']
         #swagger.summary = 'Remove o Perfil especificado pelo ID'
         #swagger.responses[404] = {
                description: "Perfil não encontrado!",
            }
         */
        try {
            //RAFAEL salvar os dados deletados em outra colection
            let profile = await Profile.findById(req.params);

            if (profile) {
                await Profile.findOneAndDelete({ _id: profile });
                res.status(200).json({});
                return;
            } else {
                res.status(404).json({ msg: "Perfil não encontrado" });
            }
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};
