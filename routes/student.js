const express = require("express");
const { studentLoginController } = require("../controllers/login");
const {
  studentGetController,
  studentPostController,
  studentGetReviewController,
  studentPostReviewController,
  studentUpdateController,
} = require("../controllers/studentController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/", studentLoginController);
router.get("/home", authenticateToken, studentGetController);
router.post("/home", authenticateToken, studentPostController);
router.get("/review", authenticateToken, studentGetReviewController);
router.post("/review", authenticateToken, studentPostReviewController);
router.post("/update", authenticateToken, studentUpdateController);

module.exports = router;
