var express = require("express");
var router = express.Router();

var controller = require("../controllers/profile.js");

router.post("/", controller.createProfile);
router.get("/getAlls", controller.getAllProfile);
router.get("/getProfileByNickName/:nickName", controller.getProfileByNickName);
router.get("/getProfileByID/:_id", controller.getProfileByID);
router.delete("/deleteProfileByID/:_id", controller.deleteProfileByID);

module.exports = router;
