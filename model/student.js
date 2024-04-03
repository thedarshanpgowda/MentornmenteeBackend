const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  usn: { require: true, type: String },
  password: String,
  name: String,
  phone: String,
  email: String,
  branch: String,
  sem: Number,
}); 

module.exports = mongoose.model("students", studentSchema);
