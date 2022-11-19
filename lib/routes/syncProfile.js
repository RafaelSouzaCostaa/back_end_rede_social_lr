var express = require("express");
var router = express.Router();

const controllerSyncProfile = require("../controllers/controllerSyncProfile");
const authVerify = require("../../authVerify");

router.get("/", authVerify.private, controllerSyncProfile.syncProfileByToken);

module.exports = router;
