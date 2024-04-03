const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  qid: String,
  usn: String,
  id: String,
  question: String,
  answer: String,
  isAnswered: Boolean,
  answeredTime: Date,
  isFile : Boolean,
  hideUsn: Boolean,
  date: Date,
});

// questionSchema.index({ answeredTime: 1 }, { expireAfterSeconds: 259200 });

module.exports = mongoose.model("questions", questionSchema);
