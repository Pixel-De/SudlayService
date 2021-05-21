const express = require("express");
const { db } = require("../models/Course");
const router = express.Router();

// mongodb user model
const Course = require("../models/Course");

const checkFields = (fields) => (fields.indexOf("") === -1 ? true : false);

//create

router.post("/add", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: "Амжилттай нэмэгдлээ",
  });
});

//course list

router.get("/list", (req, res) => {
  let lists = db.collection("courses");

  res.json({
    status: "SUCCESS",
    list: lists.toArray(),
  });
});

module.exports = router;
