const categoryModel = require("../models/category.model");
const ajv = require("../utils/ajv.utils");
const { updateUser } = require("../models/user.model");

const schema = {
  profile: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 255,
      },
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
      },
      address: {
        type: "string",
      },
    },
    required: ["name", "email"],
    errorMessage: {
      properties: {
        name: "Name is required.",
        email: "Email is required.",
        password: "Password must be at least 8 characters long.",
        address: "Address must be at least 8 characters long.",
      },
    },
  },
};

const indexView = async (req, res, next) => {
  const categories = await categoryModel.getCategories(req.user.id);

  res.render("dashboard/index", {
    preTitle: "Welcome",
    title: req.user.name,
    user: req.user,
    data: {
      categories,
    },
  });
};

const profile = async (req, res, next) => {
  const categories = await categoryModel.getCategories(req.user.id);

  const errors = [];
  if (req.method === "POST") {
    const validate = ajv.compile(schema.profile);
    const valid = validate(req.body);
    if (validate.errors) {
      validate.errors.map((error) => {
        errors.push(error.message);
      });
    }

    if (valid) {
      try {
        await updateUser(req.user, req.body);
        return res.redirect("/"); // Redirect to home after updating profile
      } catch (e) {
        console.error(e);
        errors.push("Email already exists.");
      }
    }
  }

  res.render("dashboard/profile", {
    title: "Profile",
    user: req.user,
    errors,
    categories,
  });
};

// New function to handle search for categories
const searchCategories = async (req, res, next) => {
  const query = req.query.query || "";  // Get the query from the URL

  // Fetch categories based on the search query
  const categories = await categoryModel.searchCategories(query, req.user.id);

  res.render("dashboard/index", {
    preTitle: "Search Results",
    title: req.user.name,
    user: req.user,
    data: {
      categories,
    },
    query,  // Pass the query back to the view to highlight matching categories
  });
};




module.exports = {
  indexView,
  profile,
  searchCategories,  // Export the new searchCategories function
};
