const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  id: { require: true, type: String },
  password: String,
  name: String,
  phone: Number,
  email: String,
  branch: String,
});

module.exports = mongoose.model("faculties", facultySchema);
