const express = require("express");
const router = express.Router();

const controllerComment = require("../controllers/controllerComment");
const controllerSubComment = require("../controllers/controllerSubComment");

router.post("/create/:profileObjectIdPost", controllerComment.createComment);
router.post(
    "/createSubComment/:profileObjectIdPost",
    controllerSubComment.createSubComment
);
router.delete(
    "/deleteById/:profileObjectIdPost/:commentObjectID",
    controllerComment.deleteByID
);
router.delete(
    "/deleteSubComment/:profileObjectIdPost/:commentObjectID/:subCommentObjectID",
    controllerSubComment.deleteSubComment
);

module.exports = router;
