const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  usn: { type: String, require: true },
  id: { type: String, require: true },
  cie1: Object,
  cie2: Object,
  cie3: Object,
  see: Object,
});

module.exports = mongoose.model("reviews", reviewSchema);
