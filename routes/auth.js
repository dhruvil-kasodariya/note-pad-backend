const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  let encryptPassword = CryptoJS.AES.encrypt(
    req.body.password,
    process.env.CRYPTIC_PASSWORD_KEY
  ).toString();
  const newUser = new User({
    username: req.body.username,
    useremail: req.body.useremail,
    password: encryptPassword,
  });

  try {
    const savedUser = await newUser.save();
    if (savedUser) {
      const id = savedUser._id.toString();
      const accessToken = jwt.sign(
        {
          id: id,
        },
        process.env.JWT_KEY,
        { expiresIn: "3d" }
      );
      const { password, ...others } = savedUser._doc;
      res.status(201).send({ ...others, accessToken });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ useremail: req.body.useremail });
    !user && res.status(401).send({ messege: "User not found" });

    if (user) {
      const decryptPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.CRYPTIC_PASSWORD_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (decryptPassword !== req.body.password) {
        res.status(401).send({ messege: "Wrong Password" });
        return;
      }

      const id = user._id.toString();

      const accessToken = jwt.sign(
        {
          id: id,
        },
        process.env.JWT_KEY,
        { expiresIn: "3d" }
      );
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    }
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
