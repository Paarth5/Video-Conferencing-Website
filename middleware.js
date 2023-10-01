const passport = require("passport");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  } else next();
};
