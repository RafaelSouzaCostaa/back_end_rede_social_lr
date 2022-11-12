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
                    image: "http//url/pnh/jpeg/"
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

        */

        try {
            var profiles = await Profile.find();
            res.status(200).json(profiles);
        } catch (error) {
            res.status(400).json({ msg: error });
        }
    },
};
