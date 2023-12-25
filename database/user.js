const mongoose = require("mongoose");
const database = "MANAGER_ROOM";
const ip = "127.0.0.1:27017";
const { DELETE, ROLE } = require("../const");

mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    username: String,
    password: String,
    confirmPassword: String,
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
module.exports = usersModel;
