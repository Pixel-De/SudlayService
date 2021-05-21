const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Хичээл худалдаж авах үе

const PointSchema = new Schema({
  userId: String,
  points: Number,
});

const Points = mongoose.model("pointsBuy", PointSchema);

module.exports = Points;
