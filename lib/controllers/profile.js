let mongoose = require("mongoose");
let Profile = require("../model/Profile");

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
        */
        const { name, nickName, email, password, phone, image } = req.body;

        const profile = {
            name,
            nickName,
            email,
            password,
            phone,
            image,
        };

        try {
            await Profile.create(profile);
            res.status(200).json({ msg: "Profile Criado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: "Falha ao criar profile!" });
            console.log(error);
        }
    },
    getAllProfile: async function (req, res, next) {
        /*
            #swagger.tags = ['Profile']
            #swagger.summary = 'Buscando todos os Profiles'
        */

        try {
            var profiles = await Profile.find(null, {
                password: 0,
            });

            if (profiles.length == 0) {
                res.status(404).json({ msg: "Profiles não encontrados!" });
            } else {
                res.status(200).json(profiles);
            }
        } catch (error) {
            res.status(400).json({ msg: error });
        }
    },
    getNickNameProfile: async function (req, res, next) {
        /*  
            #swagger.tags = ['Profile']
            #swagger.summary = 'Buscando profile por nickName'
            #swagger.parameters['nickName'] = {nickName: 'nickName'}
        */
        const nickName = req.params;
        try {
            var profile = await Profile.find(nickName, {
                password: 0,
            });

            if (profile.length == 0) {
                res.status(404).json({ msg: "Profile não encontrados!" });
            } else {
                res.status(200).json(profile);
            }
        } catch (error) {
            res.status(400).json({ msg: error });
        }
    },
};
