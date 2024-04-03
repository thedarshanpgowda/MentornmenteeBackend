const questionModel = require("../model/question");

async function facultyGetController(req, res) {
  try {
    if (req.user.userType === "faculty") {
      const searchCondition = { id: req.user.id, isAnswered: false };
      // console.log(req.user.id);
      questionModel
        .find(searchCondition)
        .then((datas) => {
          datas.forEach((data) => {
            if (data.hideUsn == true) {
              data.usn = null;
            }
          });
          res.status(200).json({
            status: "200: Success",
            message: "Question retrieved",
            data: datas,
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/facultyController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to retrieve question",
          });
        });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Unauthorized faculty",
      });
    }
  } catch (err) {
    console.log(`Error: controllers/facultyController.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to retrieve question",
    });
  }
}
async function facultyPostController(req, res) {
  try {
    if (req.user.userType === "faculty") {
      const updateFields = {
        answer: req.body.answer,
        isAnswered: true,
        answeredTime: new Date(),
      };
      const searchCondition = { qid: req.body.qid };

      questionModel
        .findOneAndUpdate(searchCondition, updateFields)
        .then(() => {
          res.status(200).json({
            status: "200: Success",
            message: "Answer submitted",
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/facultyController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to submit answer",
          });
        });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Unauthorized faculty",
      });
    }
  } catch (err) {
    console.log(`Error: controllers/facultyController.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to submit answer",
    });
  }
}

module.exports = { facultyGetController, facultyPostController };
