module.exports = (req, res, next) => {
  let role = req.user.role;

  if (role >= 1) {
    next();
  } else {
    response.responseError(res, { message: "Your role not enough" }, 500);
  }
};
