var express = require("express");
var router = express.Router();

var controller = require("../controllers/controllerPost");

router.post("/create", controller.create);
router.post("/setPostLike", controller.setPostLike);
router.get("/getAll", controller.getAll);
router.get("/getAllByFollow", controller.getAllByFollow);
router.get("/getAllByProfileId/:_id", controller.getAllByProfileId);
router.delete("/deleteById/:_idProfile/:_idPost", controller.deleteByID);
router.delete("/removePostLike", controller.removePostLike);
module.exports = router;
