var express = require("express");
var router = express.Router();

const authVerify = require("../../authVerify");

var controller = require("../controllers/controllerProfile.js");

router.post("/create", controller.create);
router.get("/getAll", authVerify.private, controller.getAll);
router.get("/getByNickname/:nickname",controller.getByNickname);//authVerify.private,
router.get("/getById/:_id", controller.getById);//, authVerify.private
router.delete("/deleteById/:_id", controller.deleteByID); ////, authVerify.private
router.post(
    "/follow/:followObjectId",
    authVerify.private,
    controller.followById
);
router.get(
    "/getProfileByToken",
    authVerify.private,
    controller.getProfileByToken
);

module.exports = router;
