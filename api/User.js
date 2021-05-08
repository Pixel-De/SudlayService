const express = require("express");
const router = express.Router();

// mongodb user model
const User = require("./../models/User");

// Password handler
const bcrypt = require("bcrypt");

// Signup
router.post("/signup", (req, res) => {
  let { firstname, lastname, phone, password, age, registerNum } = req.body;
  firstname = firstname.trim();
  lastname = lastname.trim();
  phone = phone.trim();
  password = password.trim();
  registerNum = registerNum.trim();

  if (
    firstname == "" ||
    phone == "" ||
    password == "" ||
    lastname == "" ||
    registerNum == "" ||
    age <= 0
  ) {
    res.json({
      status: "FAILED",
      message: "Аль нэг талбар хоосон байна!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(firstname)) {
    res.json({
      status: "FAILED",
      message: "Нэр алдаатай байна!",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Нууц үг хэт сул байна!",
    });
  } else if (!(phone.length === 8 && /^[0-9]*$/.test(phone))) {
    res.json({
      status: "FAILED",
      message: "Утасны дугаараа дахин шалгана уу!",
    });
  } else {
    // Утасны дугаар бүртгэлтэй эсэхийг шалгана
    User.find({ phone })
      .then((result) => {
        if (result.length) {
          // Хэрэглэгч хэрвээ бүртгэлтэй бол
          res.json({
            status: "FAILED",
            message: "Уучлаарай энэ дугаар бүртгэлтэй байна",
          });
        } else {
          // Шинэ хэрэглэгч үүсгэх хэсэг

          // Нууц үгээ hash хийж хадгалах хэсэг
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                firstname,
                lastname,
                phone,
                age,
                registerNum,
                password: hashedPassword,
              });

              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "Амжилттай бүртгэлээ!",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "Бүртгэх явцад алдаа гарлаа!",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Нууц үг hash хийх явцад алдаа гарлаа",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "Хэрэглэгч хайх явцад алдаа гарлаа!",
        });
      });
  }
});

// Signin
router.post("/signin", (req, res) => {
  let { phone, password } = req.body;
  phone = phone.trim();
  password = password.trim();

  if (phone == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else {
    // Check if user exist
    User.find({ phone })
      .then((data) => {
        if (data.length) {
          // User exists

          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                // Password match
                res.json({
                  status: "SUCCESS",
                  message: "Signin successful",
                  data: data,
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Invalid password entered!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while comparing passwords",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials entered!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing user",
        });
      });
  }
});

module.exports = router;