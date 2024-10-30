const passport = require("passport");

const authenticate = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("auth/login", {
        bodyClass: "d-flex flex-column bg-white",
        defaults: req.body,
        errors: [info.message],
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/dashboard");
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
};

module.exports = {
  authenticate,
  logout,
};
