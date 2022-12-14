const express = require("express");
const router = express.Router();

const controller = require("../controllers/controllerPost");

router.post("/create", controller.create);
router.post("/like", controller.like);
router.get("/getAll", controller.getAll);
router.get("/getAllByFollow", controller.getAllByFollow);
router.get("/getAllByProfileId/:_id", controller.getAllByProfileId);
router.delete("/deleteById/:_idPost", controller.deleteByID);
module.exports = router;
