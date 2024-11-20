const express = require("express");
const {
  upsertCategory,
  categoryView,
  upsertCategoryField,
  deleteCategory,
  deleteCategoryField,
  index,
  upsertCategoryData,
  deleteCategoryDataRecord,
  viewPdf,
} = require("../controllers/category.controller");
const { categoryRoute } = require("../middlewares/category.middleware");
const { upload } = require("../middlewares/multer.middleware");

const router = express.Router();

router.use("/:id/*", categoryRoute);

router.get("/:id/view", index);
router.get("/add", upsertCategory);
router.post("/add", upsertCategory);
router.get("/:id/edit", upsertCategory);
router.get("/:id/fields", categoryView);
router.post("/:id/delete", deleteCategory);
router.get("/:id/field", upsertCategoryField);
router.get("/:id/field/:fieldId", upsertCategoryField);
router.post("/:id/field/delete", deleteCategoryField);
router.post("/field", upsertCategoryField);
router.get("/:id/data", upsertCategoryData);
router.get("/:id/data/:dataId", upsertCategoryData);
router.post("/:id/data", upload.any(), upsertCategoryData);
router.post("/:id/data/delete", deleteCategoryDataRecord);

module.exports = router;
