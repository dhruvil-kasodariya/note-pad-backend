const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//Update
router.put("/update/:id", async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTIC_PASSWORD_KEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(201).send(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete
router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ messege: "your accound has been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
