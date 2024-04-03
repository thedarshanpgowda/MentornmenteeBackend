const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const studentModel = require("../model/student");
const facultyModel = require("../model/faculty");

const jwt = require("jsonwebtoken");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

async function signinController(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const passwordMatching = await bcrypt.compare(
      req.body.confirmPassword,
      hashedPassword
    );
    if (passwordMatching && "usn" in req.body) {
      const studentData = {
        usn: req.body.usn,
        password: hashedPassword,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        branch: req.body.branch,
      };


      const details = {
        usn: studentData.usn,
        userType: "student",
      };
      const accessToken = jwt.sign(details, process.env.ACCESS_TOKEN_SECRET);
      res.header("authorization", `Bearer ${accessToken}`);


      await studentModel
        .create(studentData)
        .then(() => {
          res.status(200).json({
            status: "200: Success",
            message: "Student Added",
            studentInfo: {
              usn: req.body.usn,
              name: req.body.name,


              token: accessToken,


            },

          });
        })
        .catch((err) => {
          console.log(`Error: controllers/signin.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to add student",
          });
        });
    } else if (passwordMatching && "id" in req.body) {
      const facultyData = {
        id: req.body.id,
        password: hashedPassword,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        branch: req.body.branch,
      };


       const details = {
        usn: facultyData.id,
        userType: "student",
      };
      const accessToken = jwt.sign(details, process.env.ACCESS_TOKEN_SECRET);
      res.header("authorization", `Bearer ${accessToken}`);



      await facultyModel
        .create(facultyData)
        .then(() => {
          res.status(200).json({
            status: "200: Success",
            message: "Faculty added",
            facultyInfo: {
              id: req.body.id,
              name: req.body.name,


              token: accessToken,


            },
          });
        })
        .catch((err) => {
          console.log(`Error: controllers/signin.js \n${err}`);
          res.status(400).json({
            status: "400: Bad Request",
            message: "Unable to add faculty",
            
          });
        });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Password is not matching",
      });
    }
  } catch (err) {
    console.log(`Error: controllers/signin.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to update password",
    });
  }
}

module.exports = { signinController };
