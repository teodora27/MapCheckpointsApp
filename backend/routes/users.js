const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);//this is a method of hasing
    const hashedPassword = await bcrypt.hash(req.body.password, salt);//hashing the pw with the hashing method chosen above

    //create new user
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //find user
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).json("Wrong username or password");  // return to stop further execution
    }
    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
        return res.status(400).json("Wrong username or password");  // return to stop further execution
    }
    //send response
    return res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;