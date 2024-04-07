const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = require("../model/student");
const facultyModel = require("../model/faculty");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

async function studentLoginController(req, res) {
  // console.log(req.body);
  try {
    const enteredUsn = req.body.usn;
    const enteredPassword = req.body.password;
    // console.log(enteredPassword)
    // console.log(enteredUsn)
    const studentProfile = await studentModel.findOne({ usn: enteredUsn });
    const checkPassword =
      (await bcrypt.compare(enteredPassword, studentProfile.password));
    // console.log(checkPassword)

    // console.log(studentProfile.password)
    // console.log(await bcrypt.hash(enteredPassword,10))

    if (checkPassword) {
      const details = {
        usn: studentProfile.usn,
        userType: "student",
      };
      const accessToken = jwt.sign(details, process.env.ACCESS_TOKEN_SECRET);
      res.header("authorization", `Bearer ${accessToken}`);
      res.status(200).json({
        status: "200: OK",
        message: "Access granted",
        studentInfo: {
          data: studentProfile,
          token: accessToken
        },
      });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Invalid USN or Password",
      });
    }
  } catch (err) {
    console.log(`Error: server/controllers/login.js \n${err}`);
    res
      .status(500)
      .json({ status: "500: Internal Server Error", message: "Server error" });
  }
}
async function facultyLoginController(req, res) {
  try {
    const enteredId = req.body.id;
    const enteredPassword = req.body.password;
    const facultyProfile = await facultyModel.findOne({ id: enteredId });
    const checkPassword =
      facultyProfile &&
      (await bcrypt.compare(enteredPassword, facultyProfile.password));

    if (checkPassword) {
      const details = {
        id: facultyProfile.id,
        userType: "faculty",
      };
      const accessToken = jwt.sign(details, process.env.ACCESS_TOKEN_SECRET);
      res.header("authorization", `Bearer ${accessToken}`);
      res.status(200).json({
        status: "200: OK",
        message: "Access granted",
        facultyInfo: {
          id: facultyProfile.id,
          name: facultyProfile.name,
          token: accessToken
        },
      });
    } else {
      res.status(400).json({
        status: "400: Bad Request",
        message: "Invalid ID or Password",
      });
    }
  } catch (err) {
    console.log(`Error: server/controllers/authentication.js \n${err}`);
    res
      .status(500)
      .json({ status: "500: Internal Server Error", message: "Server error" });
  }
}

module.exports = { studentLoginController, facultyLoginController };
