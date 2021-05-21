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
                points: 0,
                password: hashedPassword,
              });

              newUser
                .save()
                .then((result) => {
                  res.status(200).json({
                    status: "SUCCESS",
                    message: "Амжилттай бүртгэлээ!",
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
const generateRandom = () => {
  let tmp = "";
  for (let i = 0; i < 1; i++) {
    tmp += Date.now();
  }
  return tmp;
};

router.post("/login", (req, res) => {
  let { phone, password } = req.body;
  phone = phone.trim();
  password = password.trim();

  if (phone == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Аль нэг талбар хоосон байна!",
    });
  } else {
    // Хэрэв хэрэглэгч байвал
    User.find({ phone })
      .then((data) => {
        if (data.length) {
          // Хэрэглэгч олдвол
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                // Нууц үг таарч байвал
                res.json({
                  status: "SUCCESS",
                  message: "Амжилттай нэвтэрлээ!",
                  token: data[0]._id + generateRandom(),
                  data: {
                    id: data[0]._id,
                    firstname: data[0].firstname,
                    lastname: data[0].lastname,
                    registerNum: data[0].registerNum,
                    age: data[0].age,
                    phone: data[0].phone,
                    point: data[0].points,
                  },
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Нууц үг эсвэл утасны дугаар буруу байна!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Нууц үг эсвэл утасны дугаар буруу байна!",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Нууц үг эсвэл утасны дугаар буруу байна!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "Нэвтрэх үед алдаа гарлаа!",
        });
      });
  }
});

module.exports = router;
