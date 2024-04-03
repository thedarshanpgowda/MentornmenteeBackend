const express = require("express");
const { facultyLoginController } = require("../controllers/login");
const {
  facultyGetController,
  facultyPostController,
} = require("../controllers/facultyController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/", facultyLoginController);
router.get("/home", authenticateToken, facultyGetController);
router.post("/home", authenticateToken, facultyPostController);

module.exports = router;
