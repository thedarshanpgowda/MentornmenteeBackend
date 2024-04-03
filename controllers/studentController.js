const questionModel = require("../model/question");
const uuid = require("uuid");

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
      console.log(req.body)
      const questionData = {
        qid: uuid.v4(),
        usn: req.user.usn,
        id: req.body.id,
        question: req.body.question,
        answer: "",
        isAnswered: false,
        hideUsn: req.body.hideUsn,
        isFile : req.body.isFile,
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

module.exports = { studentGetController, studentPostController };
