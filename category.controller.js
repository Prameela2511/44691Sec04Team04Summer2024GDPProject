const createError = require("http-errors");
const categoryModel = require("../models/category.model");
const ajv = require("../utils/ajv.utils");
const moment = require("moment");
const { createSchema } = require("../utils/categories.utils");
const { parseExtraFields } = require("../utils/common.utils");

const schema = {
  category: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 255,
      },
      maxFields: {
        type: "string",
        pattern: "^[1-9]|10$",
      },
    },
    required: ["name", "maxFields"],
    errorMessage: {
      properties: {
        name: "Name is required.",
        maxFields: "Max fields must be between 1 and 10.",
      },
    },
  },
  field: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
      type: {
        type: "string",
        pattern: "Text|Number|Date|Time|DateTime|Boolean|Enum|Image|Document",
      },
      options: {
        type: "string",
      },
    },
    required: ["name", "type"],
    errorMessage: {
      properties: {
        name: "Name is required.",
        type: "Type is required.",
        options: "Options must be a comma separated list of values.",
      },
    },
  },
};

const index = async (req, res, next) => {
  const categories = await categoryModel.getCategories(req.user.id);
  const data = await categoryModel.getCategoryData(req.category.id);

  for (let record of data) {
    for (let field of req.category.fields) {
      if (field.key in record.data) {
        if (record.data[field.key] === "") {
          continue;
        }

        if (field.type === "DateTime") {
          // Format time with moment.js. Convert to 12-hour format.
          record.data[field.key] = moment(record.data[field.key]).format(
            "MMM D, YYYY h:mm A"
          );
          continue;
        }

        if (field.type === "Date") {
          // Format time with moment.js.
          record.data[field.key] = moment(record.data[field.key]).format(
            "MMM D, YYYY"
          );
          continue;
        }

        if (field.type === "Time") {
          // Format time with moment.js. Convert to 12-hour format.
          record.data[field.key] = moment(
            record.data[field.key],
            "HH:mm"
          ).format("hh:mm A");
          continue;
        }
      }
    }
  }
  res.render("dashboard/category/index", {
    title: req.category.name,
    user: req.user,
    category: req.category,
    categories,
    data,
  });
};

const upsertCategory = async (req, res, next) => {
  const errors = [];
  let defaults = {};

  if (req.method === "GET" && req.params.id) {
    const category = req.category;
    defaults = {
      id: category.id,
      name: category.name,
      maxFields: category.maxFields,
      allowExtraFields: category.allowExtraFields,
    };
  }

  if (req.method === "POST") {
    const validate = ajv.compile(schema.category);
    const valid = validate(req.body);
    if (validate.errors) {
      validate.errors.map((error) => {
        errors.push(error.message);
      });
    }

    if (valid) {
      try {
        const category = await categoryModel.upsertCategory(
          req.user.id,
          req.body
        );
        return res.redirect(`/dashboard/category/${category.id}/fields`);
      } catch (e) {
        console.error(e);
        errors.push("An error occured while creating the category.");
      }
    }

    defaults = { ...req.body };
  }

  res.render("dashboard/category/category-form", {
    title: "Add Category",
    defaults,
    errors,
  });
};

const upsertCategoryField = async (req, res, next) => {
  const fieldTypes = await categoryModel.getFieldTypes();
  const errors = [];
  let defaults = {};

  let category = req.category;

  if (req.method === "GET" && req.params.fieldId) {
    const field = await categoryModel.getField(
      req.category.id,
      req.params.fieldId
    );

    if (!field) {
      return next(createError(404, "Field not found."));
    }

    defaults = {
      id: field.id,
      name: field.name,
      type: field.type,
      isRequired: field.isRequired,
      options: field.options,
    };
  }

  if (req.method === "POST") {
    const validate = ajv.compile(schema.field);
    const valid = validate(req.body);
    if (validate.errors) {
      validate.errors.map((error) => {
        errors.push(error.message);
      });
    }

    if (valid) {
      try {
        const field = await categoryModel.upsertField(req.body);
        return res.redirect(`/dashboard/category/${field.categoryId}/fields`);
      } catch (e) {
        console.error(e);
        errors.push("An error occured while creating the category field.");
      }
    }

    defaults = { ...req.body };
    if (!category) {
      category = await categoryModel.getCategory(
        req.user.id,
        req.body.categoryId
      );
    }
  }

  res.render("dashboard/category/field-form", {
    title: "Category Fields",
    defaults,
    errors,
    fieldTypes,
    category,
  });
};

const upsertCategoryData = async (req, res, next) => {
  const categories = await categoryModel.getCategories(req.user.id);
  const errors = [];
  let defaults = {};

  if (req.method === "GET" && req.params.dataId) {
    const data = await categoryModel.getCategoryDataById(
      req.category.id,
      req.params.dataId
    );

    if (!data) {
      return next(createError(404, "Data record not found."));
    }

    defaults = {
      ...data.data,
      id: data.id,
    };
  }

  if (req.method === "POST") {
    const validate = ajv.compile(await createSchema(req.category));
    const valid = validate(req.body);
    if (validate.errors) {
      validate.errors.map((error) => {
        errors.push(error.message);
      });
    }

    if (valid) {
      try {
        const data = await categoryModel.upsertData(
          req.category.id,
          req.body,
          req.files
        );
        return res.redirect(`/dashboard/category/${req.category.id}/view`);
      } catch (e) {
        console.error(e);
        errors.push("An error occured while inserting the category data.");
      }
    }

    const extras = parseExtraFields(req.body);
    defaults = { ...req.body, extras };
  }

  res.render("dashboard/category/data-form", {
    title: req.category.name,
    user: req.user,
    errors,
    category: req.category,
    categories,
    defaults,
  });
};

const categoryView = async (req, res, next) => {
  res.render("dashboard/category/fields", {
    title: "Category Fields",
    category: req.category,
  });
};

const deleteCategory = async (req, res, next) => {
  await categoryModel.deleteCategory(req.user.id, req.body.id);

  return res.redirect("/dashboard");
};

const deleteCategoryField = async (req, res, next) => {
  await categoryModel.deleteField(req.category.id, req.body.id);

  return res.redirect(`/dashboard/category/${req.category.id}/fields`);
};

const deleteCategoryDataRecord = async (req, res, next) => {
  const data = await categoryModel.getCategoryDataById(
    req.category.id,
    req.body.id
  );

  if (!data) {
    return next(createError(404, "Data record not found."));
  }

  await categoryModel.deleteCategoryData(req.category.id, req.body.id);

  res.redirect(`/dashboard/category/${req.category.id}/view`);
};

module.exports = {
  index,
  upsertCategory,
  upsertCategoryField,
  upsertCategoryData,
  categoryView,
  deleteCategory,
  deleteCategoryField,
  deleteCategoryDataRecord,
};
