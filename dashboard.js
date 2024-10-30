const express = require("express");
const {
  indexView,
  profile,
  tabs,
} = require("../controllers/dashboard.controller");
const { protectedRoute } = require("../middlewares/routes.middleware");
const categoryRouter = require("./category");
const resourceRouter = require("./resource");

const router = express.Router();

router.use(protectedRoute);

router.use("/category", categoryRouter);
router.use("/resource", resourceRouter);

router.get("/", indexView);
router.get("/profile", profile);
router.post("/profile", profile);

module.exports = router;
