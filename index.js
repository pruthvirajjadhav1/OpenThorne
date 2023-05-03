const express = require("express");
const connectWithDb = require("./config/db");
const bodyParser = require("body-parser");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const userController = require("./controllers/user");

const app = express();
connectWithDb();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(
  new Auth0Strategy(
    {
      domain: process.env.NAME,
      clientID: process.env.ID,
      clientSecret: process.env.session,
      callbackURL: process.env.URL,
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      userController.authenticateUser(profile, done);
    }
  )
);

app.post("/login", (req, res) => {
  userController.loginUser(req, res);
});

app.post("/register", (req, res) => {
  userController.registerUser(req, res);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
