module.exports = (req, res, next) => {
  let role = req.user.role;
  if (role >= 2) {
    next();
  } else {
    res.json({ message: "Your role not enough" });
  }
};
