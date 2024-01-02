module.exports = (req, res, next) => {
  let role = req.user.role;
  if (role >= 3) {
    console.log("pass check role user");
    next();
  } else {
    res.json({ message: "Your role not enough" });
  }
};
