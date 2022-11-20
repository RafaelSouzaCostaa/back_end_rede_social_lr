var express = require("express");
var router = express.Router();

var controller = require("../controllers/controllerPost");

router.post("/create", controller.create);
router.get("/getAll", controller.getAll);
router.get("/getAllByFollow", controller.getAllByFollow);

module.exports = router;
