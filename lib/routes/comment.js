const express = require("express");
const router = express.Router();

const controllerComment = require("../controllers/controllerComment");
const controllerSubComment = require("../controllers/controllerSubComment");

router.post("/create/:profileObjectId", controllerComment.createComment);
router.post(
    "/createSubComment/:profileObjectId",
    controllerSubComment.createSubComment
);
router.delete(
    "/deleteById/:profileObjectId/:commentObjectID",
    controllerComment.deleteByID
);
router.delete(
    "/deleteSubComment/:profileObjectId/:commentObjectID/:subCommentObjectID",
    controllerSubComment.deleteSubComment
);

module.exports = router;
