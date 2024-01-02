var jwt = require("jsonwebtoken");
const { KEY_TOKEN } = require("../const");
const usersModel = require("../database/user");
const bcrypt = require("bcrypt");
const response = require("../controller/response");

var checkLogin = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  usersModel
    .findOne({ username: username })
    .then((data) => {
      if (!data) {
        return res.json("WRONG PASSWORD OR USERNAME");
      }
      if (data.deleted === 1) {
        return res.json({ message: "Your accounter is deleted" });
      }
      bcrypt.compare(password, data.password, function (err, result) {
        if (err) {
          res.json("WRONG PASSWORD OR USERNAME");
        }
        if (!result) {
          res.json("WRONG PASSWORD OR USERNAME");
        }
        var id = data._id.toString();
        let token = jwt.sign({ id }, KEY_TOKEN.keyToken, {
          expiresIn: "2d",
        });
        // console.log(token);
        const { password, ...other } = data._doc;
        req.user = { data: { ...other }, token: token };

        next();
      });
    })
    .catch((err) => {
      response.response(res, err, 404);
    });
};

module.exports = checkLogin;
