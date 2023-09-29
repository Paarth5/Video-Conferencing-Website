const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const passport = require("passport");
const localPassport = require("passport-local");
const User = require("./models/users");
const session = require("express-session");

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionConfig = {
  secret: process.env.SECRET || "idkthesecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .then(() => {
    console.log("Connected to MongoDB!!");
  })
  .catch((err) => {
    console.log("Error in connecting to Mongo", err);
  });
app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/home", (req, res) => {
  res.render("home", { user: req.user });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/home");
  }
);
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  const { user } = req.body;
  const newUser = new User({ ...user, username: user.username });
  const regUser = await User.register(newUser, user.password);
  req.logIn(regUser, (err) => {
    if (err) return next(err);
    res.redirect("/home");
  });
});
app.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/home");
  });
});

app.listen(PORT, () => {
  console.log(`Connected to server Port ${PORT} !!!`);
});
