const express = require("express");
const { studentLoginController } = require("../controllers/login");
const {
  studentGetController,
  studentPostController,
} = require("../controllers/studentController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/", studentLoginController);
router.get("/home", authenticateToken, studentGetController);
router.post("/home", authenticateToken, studentPostController);

module.exports = router;
