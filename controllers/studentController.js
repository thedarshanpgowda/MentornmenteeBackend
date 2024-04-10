const questionModel = require("../model/question");
const reviewModel = require("../model/review");
const studentModel = require("../model/student");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function studentGetController(req, res) {
  try {
    if (req.user.userType === "student") {
      const searchCondition = { usn: req.user.usn };
      questionModel
        .find(searchCondition)
        .then((data) => {
          res.status(200).json({
            status: "200: Success",
            message: "Question retrieved",
            data: data,
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/studentController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to retrieve question",
          });
        });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Unauthorized student",
      });
    }
  } catch (err) {
    console.log(`Error: controllers/studentController.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to retrieve question",
    });
  }
}

async function studentPostController(req, res) {
  try {
    if (req.user.userType === "student") {
      console.log(req.body);
      const questionData = {
        qid: uuid.v4(),
        usn: req.user.usn,
        id: req.body.id,
        question: req.body.question,
        answer: "",
        isAnswered: false,
        hideUsn: req.body.hideUsn,
        isFile: req.body.isFile,
        answeredTime: null,
        date: new Date(),
      };
      questionModel
        .create(questionData)
        .then(() => {
          res.status(201).json({
            status: "201: Created",
            message: "Question submitted",
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/studentController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to submit question",
          });
        });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Unauthorized student",
      });
    }
  } catch (err) {
    console.log(`Error: controllers/studentController.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to submit question",
    });
  }
}

async function studentGetReviewController(req, res) {
  try {
    if (req.user.userType === "student") {
      const searchCondition = { usn: req.user.usn };
      const [studentData, reviewData] = await Promise.all([
        studentModel.findOne(searchCondition),
        reviewModel.findOne(searchCondition),
      ]);
      

      if (studentData && reviewData) {
        res.status(200).json({
          status: "200: Success",
          message: "Student data & Reviews retrieved",
          studentInfo: studentData,
          reviewData: reviewData,
        });
      } else {
        console.log(`Error: controllers/studentController.js \n${err}`);
        res.status(400).json({
          status: "400: Bad Request",
          message: "Unable to retrieve Student data & Reviews",
        });
      }
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Unauthorized student",
      });
    }
  } catch (err) {
    console.log(
      `Error: controllers/studentController.js - studentGetReviewController \n${err}`
    );
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to retrieve review",
    });
  }
}

async function studentPostReviewController(req, res) {
  try {
    if (req.user.userType === "student") {
      const searchCondition = { usn: req.user.usn };
      const updateData = req.body;
      await reviewModel
        .findOneAndUpdate(searchCondition, updateData)
        .then(() => {
          res.status(200).json({
            status: "200: Success",
            message: "Review added",
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/studentController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to add reviews",
          });
        });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Unauthorized student",
      });
    }
  } catch (err) {
    console.log(`Error: controllers/studentController.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to submit review",
    });
  }
}

async function studentUpdateController(req, res) {
  try {
    if (req.user.userType === "student") {
      const searchCondition = { usn: req.user.usn };
      const member = await studentModel.findOne({usn : req.user.usn})
      console.log(member)
      const updateData = {
        usn: req.body.id,
        password: req.body.isUpdated
          ? await bcrypt.hash(req.body.password, 10)
          : member.password,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        branch: req.body.branch,
        mentorId: req.body.mentorId,
        dob: req.body.dob,
        address: req.body.addr,
        img : req.body.img,
        father: req.body.father,
        mother: req.body.mother,
        blood: req.body.blood,
      };
      console.log(updateData)
      const details = {
        usn: updateData.usn,
        userType: "student",
      };

      const accessToken = jwt.sign(details, process.env.ACCESS_TOKEN_SECRET);
      res.header("authorization", `Bearer ${accessToken}`);

      await studentModel
        .findOneAndUpdate(searchCondition, updateData)
        .then((data) => {
          // console.log(data)
          res.status(200).json({
            status: "200: Success",
            message: "Profile-data updated",
            studentInfo: {
              data: data,
              token: accessToken,
            },
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/studentController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to update Profile",
          });
        });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Unauthorized student",
      });
    }
  } catch (err) {
    console.log(`Error: controllers/studentController.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to update Profile",
    });
  }
}

module.exports = {
  studentGetController,
  studentPostController,
  studentGetReviewController,
  studentPostReviewController,
  studentUpdateController,
};
