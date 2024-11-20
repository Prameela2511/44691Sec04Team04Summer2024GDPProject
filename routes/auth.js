const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const {
  indexView,
  registerView,
  performRegistration,
  authenticateUser,
  getUser,
} = require("../controllers/auth.controller");
const { publicRoute } = require("../middlewares/routes.middleware");
const { authenticate, logout } = require("../middlewares/auth.middleware");

passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await getUser(id);
  delete user.password;
  return done(null, user);
});

const router = express.Router();

router.get("/", publicRoute, indexView);
router.post("/", publicRoute, authenticate);
router.get("/register", publicRoute, registerView);
router.post("/register", publicRoute, performRegistration);
router.get("/logout", logout);
router.post("/logout", logout);

module.exports = router;
