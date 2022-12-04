const express = require("express");
const router = express.Router();

const controllerComment = require("../controllers/controllerComment");
const controllerSubComment = require("../controllers/controllerSubComment");

router.post("/create/:postObjectId", controllerComment.createComment);
router.post(
    "/createSubComment/:postObjectId",
    controllerSubComment.createSubComment
);
router.delete(
    "/deleteById/:postObjectId/:commentObjectID",
    controllerComment.deleteByID
);
router.delete(
    "/deleteSubComment/:postObjectId/:commentObjectID/:subCommentObjectID",
    controllerSubComment.deleteSubComment
);

module.exports = router;
