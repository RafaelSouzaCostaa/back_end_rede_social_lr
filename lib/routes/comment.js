const express = require("express");
const router = express.Router();

const controllerComment = require("../controllers/comment");
const controllerSubComment = require("../controllers/subComment");

router.post("/create", controllerComment.createComment);
router.post("/createSubComment", controllerSubComment.createSubComment);

module.exports = router;
