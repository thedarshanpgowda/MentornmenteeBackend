const questionModel = require("../model/question");
const reviewModel = require("../model/review");
const studentModel = require("../model/student");

async function facultyGetController(req, res) {
  try {
    if (req.user.userType === "faculty") {
      const searchCondition = { id: req.user.id, isAnswered: false };
      // console.log(req.user.id);
      await questionModel
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

      await questionModel
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

async function facultyGetReviewController(req, res) {
  try {
    if (req.user.userType === "faculty") {
      const searchCondition = { id: req.user.id };



      await reviewModel
        .find(searchCondition)
        .then(async (data) => {
          const newData = await Promise.all(data.map(async (stud) => {
            const usn = stud.usn;
            const studDet = await studentModel.findOne({ usn: usn });
            // console.log(studDet)
            return {
              ...stud.toObject(),
              studentInfo: studDet
            };
          }));
          res.status(200).json({
            status: "200: Success",
            message: "Review retrieved",
            data: newData,
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/facultyController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to retrieve reviews",
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
      message: "Unable to retrieve reviews",
    });
  }
}

async function facultyPostReviewController(req, res) {
  try {
    if (req.user.userType === "faculty") {
      const cieNo = req.body.cieNo;
      let updateFields = {};
      if (cieNo == 1) {
        updateFields = {
          $set: { "cie1.facultyComment": req.body.comment },
        };
      } else if (cieNo == 2) {
        updateFields = {
          $set: { "cie2.facultyComment": req.body.comment },
        };
      } else if (cieNo == 3) {
        updateFields = {
          $set: { "cie3.facultyComment": req.body.comment },
        };
      } else if (cieNo == 4) {
        updateFields = {
          $set: { "see.facultyComment": req.body.comment },
        };
      }

      const searchCondition = { usn: req.body.usn };

      reviewModel
        .findOneAndUpdate(searchCondition, updateFields)
        .then(() => {
          res.status(200).json({
            status: "200: Success",
            message: "Review submitted",
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/facultyController.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to submit review",
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
      message: "Unable to submit review",
    });
  }
}

module.exports = {
  facultyGetController,
  facultyPostController,
  facultyGetReviewController,
  facultyPostReviewController,
};
