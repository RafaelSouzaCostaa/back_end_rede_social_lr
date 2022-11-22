const express = require("express");
const router = express.Router();

const controllerComment = require("../controllers/controllerComment");
const controllerSubComment = require("../controllers/controllerSubComment");

router.post("/create", controllerComment.createComment);
router.post("/createSubComment", controllerSubComment.createSubComment);
router.delete("/deleteById/:_id", controllerComment.deleteByID);

module.exports = router;
