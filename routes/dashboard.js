const express = require("express");
const {
  indexView,
  profile,
  searchCategories,  // Add the search handler function
} = require("../controllers/dashboard.controller");
const { protectedRoute } = require("../middlewares/routes.middleware");
const categoryRouter = require("./category");
const resourceRouter = require("./resource");

const router = express.Router();

// Middleware to protect routes
router.use(protectedRoute);

// Route for categories and resources
router.use("/category", categoryRouter);
router.use("/resource", resourceRouter);

// Route for search functionality
router.get("/search", searchCategories);  // Handle search

// Routes for dashboard views
router.get("/", indexView);               // Dashboard home page
router.get("/profile", profile);          // Get profile view
router.post("/profile", profile);         // Handle profile updates

module.exports = router;
