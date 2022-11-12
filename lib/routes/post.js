var express = require("express");
var router = express.Router();

var controller = require("../controllers/post.js");

router.post("/", controller.createPost);
router.get("/", controller.getAllPost);

module.exports = router;
