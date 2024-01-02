const passport = require("passport");
let Constant = require("../constant");
let UserModel = require("../database/user");
let LoginModel = require("../database/Login");
function setupAuthenticate(app) {
  require("./passport.config")(passport);
}
module.exports = setupAuthenticate;
