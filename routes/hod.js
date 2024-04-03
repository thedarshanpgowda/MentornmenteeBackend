const express = require("express");
const router = express.Router();
const { hodController } = require("../controllers/hod");

router.use("/", hodController);

module.exports = router;
