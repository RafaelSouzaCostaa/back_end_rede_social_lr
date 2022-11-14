var express = require("express");
var router = express.Router();

const authVerify = require("../../authVerify");

var controller = require("../controllers/profile.js");

router.post("/", controller.createProfile);
router.get("/getAlls", authVerify.private, controller.getAllProfiles);
router.get(
    "/getProfileByNickName/:nickName",
    authVerify.private,
    controller.getProfileByNickName
);
router.get(
    "/getProfileByID/:_id",
    authVerify.private,
    controller.getProfileByID
);
router.delete(
    "/deleteProfileByID/:_id",
    authVerify.private,
    controller.deleteProfileByID
);
router.post(
    "/setFollowingById/:followObjectId",
    authVerify.private,
    controller.setFollowingById
);

module.exports = router;
