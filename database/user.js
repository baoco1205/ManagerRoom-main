const mongoose = require("mongoose");
const database = "MANAGER_ROOM";
const ip = "127.0.0.1:27017";
const { DELETE, ROLE } = require("../const");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    username: String,
    password: String,
    name: String,
    address: String,
    phone: String,
    role: {
      type: Number,
      enum: [ROLE.USER, ROLE.MANAGER, ROLE.ADMIN], //các giá trị có thể nhập
      default: "1",
      index: true,
    },
    note: String,
    deleted: {
      type: Number,
      enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
  },
  { collection: "users" }
);
const usersModel = mongoose.model("users", UsersSchema);
let db = mongoose.connection;
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
module.exports = usersModel;
