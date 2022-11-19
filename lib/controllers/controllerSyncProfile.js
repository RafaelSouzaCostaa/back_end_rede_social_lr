const Profile = require("../model/Profile");

module.exports = {
    syncProfileByToken: function (req, res, next) {
        /**
            #swagger.tags = ['Profile']
         */
        let idToken = req._idToken;

        try {
            var profile = Profile.findById(idToken, {
                password: 0,
            });
            profile == null
                ? res.status(404).json({ msg: "Profile não encontrado!" })
                : res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ msg: error });
        }
    },
};
