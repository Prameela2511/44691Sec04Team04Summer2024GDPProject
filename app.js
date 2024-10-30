if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const expressSession = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma/client");

const indexRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Logger setup
app.use(logger("dev"));

// Data parsing setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session setup
app.use(cookieParser());
app.use(
  expressSession({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdIsSessionId: false,
      ttl: 12 * 60 * 60 * 1000, // 12 hours
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    },
  })
);

// Authentication setup
app.use(passport.initialize());
app.use(passport.session());

// Routes setup
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/dashboard", dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
