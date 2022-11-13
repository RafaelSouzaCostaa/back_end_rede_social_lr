const express = require("express");
const router = express.Router();

const controller = require("../controllers/comment");

router.post("/", controller.createComment);
router.get("/:_id", controller.getCommentByID);
router.post("/addSubComment/:_id", controller.addSubComment);
router.delete(
    "/deleteSubCommentByIDs/:_idComment/:_idSubComment",
    controller.deleteSubCommentByIDs
);
router.delete("/deleteCommentByID/:_id", controller.deletarCommentByID);

module.exports = router;
