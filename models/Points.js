const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Хэрэглэгчийн оноог хадгалах схем
const PointSchema = new Schema({
  userId: String,
  points: Number,
});

const Points = mongoose.model("point", PointSchema);

module.exports = Points;
