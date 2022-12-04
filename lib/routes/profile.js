var express = require("express");
var router = express.Router();

const authVerify = require("../../authVerify");

var controller = require("../controllers/controllerProfile.js");

router.post("/create", controller.create);
router.get("/getAll", authVerify.private, controller.getAll);
router.get("/getByNickname/:nickname", authVerify.private, controller.getByNickname);
router.get("/getById/:_id", authVerify.private, controller.getById);
router.delete("/deleteById/:_id", authVerify.private, controller.deleteByID);
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
