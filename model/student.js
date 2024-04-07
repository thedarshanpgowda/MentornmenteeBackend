const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  usn: { require: true, type: String },
  password: String,
  name: String,
  phone: String,
  email: String,
  branch: String,
  mentorId: String,
  dob: Date,
  address: String,
  father: String,
  mother: String,
  blood: String,
  sem: String,
});

module.exports = mongoose.model("students", studentSchema);
