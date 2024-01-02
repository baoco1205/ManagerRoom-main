var brypt = require("bcrypt");
// const Joi = require("@hapi/joi");
var url = require("url");

// const checkAuth = require("../middleware/checkPassport");
//CONST
const { ROLE, CHECK_SCHEMA } = require("../const.js");
const usersModel = require("../database/user.js");
const without = require("./without.js");
const response = require("./response.js");
const BaseController = require("./base.controller.js");
//middware
// routerUsers.use(checkAuth.checkAuth);
//
///////////////NEW CODE VIET O DAY
class UserController extends BaseController {
  static findUser(req, res, next) {
    let { id, username } = req.body;
    usersModel
      .findOne({ username: username })
      .then((user) => {
        response.response(res, user);
      })
      .catch((err) => {
        response.responseError(res, err, 404);
      });
  }
  static createUser(req, res) {
    var { username, password, name, address, phone, role, note } = req.body;
    CHECK_SCHEMA.CREATE_USER_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        usersModel.findOne({ username: username }).then(async (data) => {
          if (data) {
            response.responseError(res, { error: "dupllicated username" }, 400);
          } else {
            let salt = await brypt.genSalt(10);
            let hashPassword = await brypt.hash(password, salt);
            password = hashPassword;
            usersModel
              .create({
                username: username,
                password: password,
                name: name,
                address: address,
                phone: phone,
                role: role,
                note: note,
              })
              .then((data) => {
                const user = without.withoutPassword(data);
                console.log(data);
                response.response(res, user, "CREATE SUCCESS");
                // res.json({ message: "Create success", data: user });
              });
          }
        });
      })
      .catch((err) => {
        response.responseError(res, err, 500);
      });
  }
  static myInfo(req, res, next) {
    var username = req.user.username;
    usersModel
      .findOne({ username: username })
      .then((data) => {
        response.response(res, data, "Get info success");
      })
      .catch((err) => {
        response.responseError(res, err, 400);
      });
  }
  static resetPassword(req, res, next) {
    let { username, password } = req.body;
    usersModel
      .findOne({ username: username })
      .then((data) => {
        if (!data) {
          response.responseError(
            res,
            { message: "Username does not exist" },
            401
          );

          if (data) {
            brypt.hash(password, saltRounds, function (err, hash) {
              usersModel
                .findOneAndUpdate({ password: hash })
                .then((data) => {
                  response.response(res, data);
                })
                .catch((err) => {
                  response.responseError(res, err, 400);
                });
            });
          }
        }
      })
      .catch((err) => {
        response.responseError(res, err, 400);
      });
  }
  static getUser(req, res) {
    let { role } = req.user;
    if (role <= 1) {
      return response.response(
        res,
        undefined,
        "Your role not enough to do this!"
      );
    }
    if (role === ROLE.MANAGER) {
      usersModel
        .find({ deleted: 0, role: { $lt: ROLE.MANAGER } })
        .then((data) => {
          response.response(res, data);
        })
        .catch((err) => {
          response.responseError(res, err, 404);
        });
    }
    if (role === ROLE.ADMIN) {
      usersModel
        .find({ deleted: 0, role: { $lt: ROLE.ADMIN } })
        .then((data) => {
          var url_parts = url.parse(req.url, true);
          console.log(url_parts);
          response.response(res, data);
        })
        .catch((err) => {
          response.responseError(res, err, 404);
        });
    }
  }
  static updateUser(req, res) {
    var { role } = req.user;
    let { password, name, address, phone, note, id } = req.body;
    CHECK_SCHEMA.UPDATE_USER_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then(async (payload) => {
        var salt = await brypt.genSalt(10);
        var hashPassword = await brypt.hash(password, salt);
        password = hashPassword;
        if (role === ROLE.ADMIN) {
          console.log("testtt");
          usersModel
            .findByIdAndUpdate(
              {
                _id: id,
              },
              {
                password: password,
                name: name,
                address: address,
                phone: phone,
                role: role,
                note: note,
              },
              { new: true }
            )
            .then((data) => {
              if (!data) {
                response.responseError(res, { message: "Maybe wrong ID" });
              }
              if (data) {
                // console.log(data);
                data = without.withoutPassword(data);
                let message = "CREATE SUCCESS";
                response.response(res, data, message);
              } else if ((data = null)) {
                console.log(data);
                response.response(
                  res,
                  data,
                  "update fails, pls recheck id need update"
                );
              }
            });
        } else if (role === MANAGER_ROLE) {
          usersModel.findByIdAndUpdate({ _id: id }).then((data) => {
            if (!data) {
              return response.response(
                res,
                undefined,
                "Don't have id you want find"
              );
            }
            if (data.role >= MANAGER_ROLE) {
              response.response(
                res,
                undefined,
                "Can't update account equal your role"
              );
            }
          });
        } else if (role <= 1) {
          response.response(res, undefined, "YOUR ROLE NOT ENOUGH");
        }
      })
      .catch((err) => {
        response.responseError(res, err, 500);
      });
  }

  // );
  static updateMySelf(req, res) {
    let id = req.user.id;

    var { password, note, name, address, phone } = req.body;
    CHECK_SCHEMA.UPDATE_MYSELF_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then(async (data) => {
        let salt = await brypt.genSalt(10);
        let hashPassword = await brypt.hash(password, salt);
        usersModel
          .findByIdAndUpdate(
            { _id: id },
            {
              $set: {
                password: hashPassword,
                note: note,
                name: name,
                address: address,
                phone: phone,
              },
            }
          )
          .then((data) => {
            if (data) {
              let dataAfterChange = without.withoutPassword(data);
              response.response(res, dataAfterChange, "Update success");
            }
          });
      })
      .catch((err) => {
        response.responseError(res, err, 500);
      });
  }
  static deleteUser(req, res) {
    var { username } = req.body;
    usersModel
      .deleteOne({ username: username })
      .then((data) => {
        console.log(data);
        if (data.deletedCount === 0) {
          response.response(res, undefined, "DON'T HAVE ID TO DELETE");
        }
        response.response(res, undefined, "DELETE SUCCESS");
      })
      .catch((err) => {
        response.responseError(res, err, 500);
      });
  }
  static createCustomer(req, res) {
    console.log(req.body);
    var { usernameNew, passwordNew, name, address, phone, note } = req.body;
    usersModel
      .findOne({ username: usernameNew })
      .then((data) => {
        if (data) {
          res.json("User name has been used");
        } else {
          usersModel
            .create({
              username: usernameNew,
              password: passwordNew,
              name: name,
              address: address,
              phone: phone,
              role: 0,
              note: note,
            })
            .then(res.json("Create user complete!!"))
            .catch((err) =>
              res.status(500).json("Create fails, have error: " + err)
            );
        }
      })
      .catch((err) => {
        var error = new Error({ message: "CREATE CUSTOMER FAILS", Error: err });
        error.statusCode = 500;
        throw error;
      });
  }
  static softDelete(req, res, next) {
    let { _id } = req.body;
    CHECK_SCHEMA.CHECK_ID.validateAsync(req.body, { allowUnknown: false })
      .then(async (payload) => {
        console.log("testtzzz");
        usersModel.find({ _id: _id, deleted: 0 }).then((data) => {
          if (data.length === 0) {
            response.response(res, { message: "User already deleted" });
          }
          usersModel.findByIdAndUpdate(_id, { deleted: 1 }).then((data) => {
            let dataAfterChange = without.withoutPassword(data);
            response.response(res, dataAfterChange);
          });
        });
      })
      .catch((err) => {
        response.responseError(res, err, 500);
      });
  }
}
module.exports = UserController;
