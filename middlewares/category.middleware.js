const createError = require("http-errors");
const { getCategory } = require("../models/category.model");

const categoryRoute = async (req, res, next) => {
  console.log("Category middleware");

  if (req.params.id) {
    const category = await getCategory(req.user.id, req.params.id);

    if (!category) {
      return next(createError(404, "Category not found."));
    }

    req.category = category;
  }

  next();
};

module.exports = {
  categoryRoute,
};
