const Profile = require("../model/Profile");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../../variables.env" });

module.exports = {
    createProfile: async function (req, res, next) {
        /*  
            #swagger.tags = ['Profile']
            #swagger.summary = 'Criando um Profile'
             #swagger.parameters['Profile'] = { 
                in: 'body', 
                description: 'Esse obj add um profile no banco de dados', 
                required: true, 
                schema: { 
                    name: "Rafael De Souza", 
                    nickName: "leafar" ,
                    email: "leafar@leafar",
                    password: "password321",
                    phone: "12 3456-78910",
                    image: "http//url/png/jpeg/"
                } 
            }
            #swagger.responses[404] = {
                description: "Email ou NickName já está em uso!"
            }
        */

        let { name, nickName, email, password, photo, image } = req.body;

        password = await bcrypt.hash(password, parseInt(process.env.SALT));

        try {
            let resProfile = await Profile.create(
                Profile({
                    name,
                    nickName,
                    email,
                    password,
                    photo,
                    image,
                })
            );
            res.status(200).json(resProfile); //ATENCAO RETORNAR UMA MSG OU NADA FUTURAMENTE - TESTE
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
    getAllProfiles: async function (req, res, next) {
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
    getProfileByNickName: async function (req, res, next) {
        /*  
            #swagger.tags = ['Profile']
            #swagger.summary = 'Buscando profile por nickName'
            #swagger.parameters['nickName'] = {nickName: 'nickName'}
            #swagger.responses[404] = {
                description: "Profile não encontrado!",
            }
        */
        const nickName = req.params;
        try {
            var profile = await Profile.find(nickName, {
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
    getProfileByID: async function (req, res, next) {
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
    deleteProfileByID: async function (req, res, next) {
        /**
         * #swagger.tags = ['Profile']
         #swagger.summary = 'Deletar profile por ID'
         #swagger.responses[404] = {
                description: "Profile não encontrado!",
            }
         */
        const _id = req.params;
        try {
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
