const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(authHeader)
    // console.log(token)
    if (token == null) {
      return res.status(401).json({
        status: "401 : Unauthorized",
        message: "Invalid token",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userDetails) => {
      if (err) {
        return res.status(401).json({
          status: "401 : Unauthorized",
          message: "Invalid token",
          error: err,
        });
      }
      req.user = userDetails;
      next();
    });
  } catch (err) {
    console.log(`Error: middleware/auth.js \n${err}`);
    res.status(500).json({
      status: "500: Internal Server Error",
      message: "Unable to authenticate due to server error",
    });
  }
}

module.exports = { authenticateToken };
