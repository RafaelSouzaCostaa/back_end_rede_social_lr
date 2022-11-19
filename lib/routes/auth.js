const express = require("express");
const router = express.Router();

const controllerAuth = require("../controllers/controllerAuth");

router.post("/", controllerAuth.login);

module.exports = router;
