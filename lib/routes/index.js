var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    /*  
            #swagger.tags = ['Index']
            #swagger.description = 'Rota de testar API - Rede Social LR'
            #swagger.security = []
        */
    res.status(200).json({ msg: "OK" });
});
module.exports = router;
