var express = require("express");
var router = express.Router();

var controller = require("../controllers/profile.js");

router.post("/", controller.createProfile);
router.get("/getAlls", controller.getAllProfile);
router.get("/getNickNameProfile/:nickName", controller.getNickNameProfile);

module.exports = router;
