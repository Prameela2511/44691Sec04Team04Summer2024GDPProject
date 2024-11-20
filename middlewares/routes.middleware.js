const protectedRoute = async (req, res, next) => {
  console.log("Protected Routes");
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  next();
};

const publicRoute = async (req, res, next) => {
  console.log("Public Routes");
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = {
  publicRoute,
  protectedRoute,
};
