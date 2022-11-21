const Profile = require("../model/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

module.exports = {
    login: async function (req, res, next) {
        /*
         * #swagger.tags = ["Login"]
         * #swagger.summary = 'Realizar um Login'
        #swagger.parameters['Login'] = { 
            in: 'body', 
            description: 'Login', 
            required: true, 
            schema: { 
                email: 'leafar@leafar', 
                password: 'password321'
            } 
        }
        * #swagger.security = []
         */

        try {
            let resProfile = await Profile.findOne({ email: req.body.email });
            if (!resProfile) {
                res.status(403).json({ error: "Profile não existe" });
                return;
            }
            const match = await bcrypt.compare(
                req.body.password,
                resProfile.password
            );

            if (!match) {
                res.status(404).json({ error: "Email e/ou senha incorreta" });
                return;
            } else {
                const { _id, email, nickname } = resProfile;

                const token = jwt.sign(
                    { id: _id, email: email, nickname: nickname },
                    process.env.SECRET
                    //RAFAEL ativar denovo - e so apra teste{ expiresIn: 3600 }
                );
                res.status(200).json({ token: token });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
