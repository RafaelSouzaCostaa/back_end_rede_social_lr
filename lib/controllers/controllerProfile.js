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
            res.status(200).json(resProfile); //ATENCAO RETORNAR UMA MSG OU NADA FUTURAMENTE - TESTE
            return;
        } catch (error) {
            if (error.code == 11000) {
                res.status(409).json({
                    msg: "Email/NickName já em uso! Tente outro!",
                });
            } else {
                res.status(500).json({ msg: error }); //IMPLEMENTAR add .message na frente de error
            }
        }
    },
    upgradeByToken: async function (req, res, next) {
        //LUIGGI nova rota add - Verificar Doc - Padronização
        /*
            #swagger.tags = ['Profile']
            #swagger.summary = 'Atualiza um Profile'
            #swagger.responses[404] = {
                description: "Nenhum perfil encontrado no banco de dados",
            }
            #swagger.parameters['Profile'] = { 
                in: 'body', 
                description: 'Atualiza um perfil ao banco de dados', 
                required: true,
                schema: { 
                    name: "Rafael De Souza", 
                    nickname: "leafar",
                    email: "leafar@leafar",
                } 
            }
        */

        const _id = req._idProfile;

        try {
        } catch (error) {}
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
            res.status(500).json({ msg: error });
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
            res.status(500).json({ msg: error });
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
            res.status(500).json({ msg: error });
        }
    },
    //LUIGGI testa do funcionando
    followById: async function (req, res, next) {
        /**
         * #swagger.tags = ['Profile']
            #swagger.summary = 'Segue o Perfil especificado pelo ID'
         
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
                    res.status(404).json({ error: "Perfil não encontrado" });
                    return;
                }
                let isRemovedFollow = false;
                profileToken.followersObjectId.forEach((_idProfile, index) => {
                    if (_idProfile._id == followObjectId) {
                        profileToken.followersObjectId.splice(index, 1);
                        followProfile.followingObjectId.forEach((id, index) => {
                            if (id._id == idToken) {
                                followProfile.followingObjectId.splice(
                                    index,
                                    1
                                );
                            }
                        });
                        isRemovedFollow = true;
                    }
                });
                if (isRemovedFollow) {
                    profileToken.followersObjectId.push(followProfile);
                    followProfile.followingObjectId.push(idToken);
                }

                profileToken.save();
                followProfile.save();
            } else {
                res.status(404).json({ msg: "Voce não pode se seguir!" });
                return;
            }
            res.status(200).json({ msg: "add" });
            return;
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
            //RAFAEL mudei a logica aqui por que o teste tava dando problema
            let profile = await Profile.findById(req.params);

            if (profile) {
                await Profile.findOneAndDelete({ _id: profile });
                res.status(200).json({});
                return;
            } else {
                res.status(404).json({ msg: "Perfil não encontrado" });
            }
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
