var express = require("express");
var router = express.Router();

var controller = require("../controllers/post.js");

router.post("/create", controller.create);
router.get("/getAll", controller.getAll);

module.exports = router;
