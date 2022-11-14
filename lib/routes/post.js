var express = require("express");
var router = express.Router();

var controller = require("../controllers/post.js");

router.post("/", controller.createPost);
router.get("/getAllPosts", controller.getAllPosts);

module.exports = router;
