const withoutPassword = (user) => {
  {
    const { passwordNew, confirmPassword, password, ...userWithoutPassword } =
      user._doc;

    return userWithoutPassword;
  }
};

module.exports = { withoutPassword };
