let { DBCONFIG } = require("../const");
let usersModel = require("../database/user");
class databaseUtils {
  constructor() {}

  static connect(callback) {
    return this.mongooseConnect(DBCONFIG, callback);
  }
  static mongooseConnect(DBCONFIG, callback) {
    let mongoose = require("mongoose");
    mongoose.Promise = Promise;
    mongoose
      .connect(DBCONFIG.mongodb_connect_str)
      .then(() => console.log("Connected database!"));
    let db = mongoose.connection;
    this.connection = db;
    db.on("error", (e) => {
      callback(e);
    });
    db.once("open", () => {
      usersModel
        .findOne({ username: "admin@admin" })
        .then((data) => {
          if (!data) {
            let password = "passwordforadmin";
            bcrypt.hash(password, saltRounds, function (err, hash) {
              usersModel
                .create({
                  username: "admin@admin",
                  password: hash,
                  role: ROLE.ADMIN,
                })
                .then((data) => {
                  console.log("Create admin success");
                })
                .catch((err) => {
                  let error = new Error(err);
                  error.statusCode = 400;
                  throw error;
                });
            });
          }
        })
        .catch((err) => {});
    });
  }
}
module.exports = databaseUtils;
