const express = require("express");
const router = express.Router();

const controller = require("../controllers/comment");

router.post("/", controller.createComment);
router.get("/:_id", controller.getCommentByID);
router.post("/addSubComment/:_id", controller.addSubComment);

module.exports = router;
