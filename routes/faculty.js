const express = require("express");
const { facultyLoginController } = require("../controllers/login");
const {
  facultyGetController,
  facultyPostController,
  facultyGetReviewController,
  facultyPostReviewController,
} = require("../controllers/facultyController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/", facultyLoginController);
router.get("/home", authenticateToken, facultyGetController);
router.post("/home", authenticateToken, facultyPostController);
router.get("/review", authenticateToken, facultyGetReviewController);
router.post("/review", authenticateToken, facultyPostReviewController);

module.exports = router;
