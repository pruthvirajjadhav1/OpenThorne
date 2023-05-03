const User = require("../models/User");
const jwt = require("jsonwebtoken");

const secretKey = "your-secret-key";

module.exports = {
  authenticateUser: (profile, done) => {
    User.findOne({ email: profile.emails[0].value }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      const token = jwt.sign({ sub: user._id }, secretKey);
      return done(null, token);
    });
  },

  loginUser: (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ sub: user._id }, secretKey);
        return res.json({ token });
      });
    });
  },

  registerUser: (req, res) => {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    user.save((err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const token = jwt.sign({ sub: user._id }, secretKey);
      return res.json({ token });
    });
  },
};
