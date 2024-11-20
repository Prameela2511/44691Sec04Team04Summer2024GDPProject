const ajv = require("../utils/ajv.utils");
const {
  createUser,
  getUserById,
  getUserByEmail,
} = require("../models/user.model");
const { comparePassword } = require("../utils/bcrypt.utils");

const schema = {
  registration: {
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
    },
    required: ["name", "email", "password"],
    additionalProperties: false,
    errorMessage: {
      properties: {
        name: "Name is required.",
        email: "Email is required.",
        password: "Password must be at least 8 characters long.",
      },
    },
  },
};

const indexView = async (req, res, next) => {
  const defaults =
    process.env.NODE_ENV === "development"
      ? {
          email: "jane.doe@mail.com",
          password: "pass1234",
        }
      : null;

  res.render("auth/login", {
    bodyClass: "d-flex flex-column bg-white",
    defaults,
  });
};

const registerView = async (req, res, next) => {
  res.render("auth/register", { bodyClass: "d-flex flex-column" });
};

const performRegistration = async (req, res, next) => {
  const validate = ajv.compile(schema.registration);
  const valid = validate(req.body);
  const errors = [];
  if (validate.errors) {
    validate.errors.map((error) => {
      errors.push(error.message);
    });
  }

  if (valid) {
    try {
      const user = await createUser(req.body);
      if (user) {
        return res.redirect("/");
      }
    } catch (error) {
      errors.push("Email already exists.");
    }
  }

  res.render("auth/register", {
    bodyClass: "d-flex flex-column",
    defaults: req.body,
    errors,
  });
};

const authenticateUser = async (email, password, done) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return done(null, false, { message: "Invalid email or password." });
    }

    if (await comparePassword(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid email or passwrod." });
    }
  } catch (e) {
    return done(e);
  }
};

const getUser = async (id) => {
  return await getUserById(id);
};

module.exports = {
  indexView,
  registerView,
  performRegistration,
  authenticateUser,
  getUser,
};
