const mongoose = require("mongoose");
const database = "MANAGER_ROOM";
const ip = "127.0.0.1:27017";
const { REQUEST, DELETE, SESSION } = require("../const");
mongoose
  .connect(`mongodb://${ip}/${database}`)
  .then(() => console.log("Connected database!"))
  .catch((err) => {
    console.log(err);
  });
var today = new Date();
var datetimeVN = today.toLocaleString("vi-VN");

const Schema = mongoose.Schema;

const requestsSchema = new Schema(
  {
    date: {
      type: Date,
      // enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: datetimeVN,
      index: true,
    },
    numberCustomer: {
      type: Number,
      // enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
    status: {
      type: Number,
      enum: [REQUEST.OFF, REQUEST.ON, REQUEST.DOING],
      default: REQUEST.OFF,
      index: true,
    }, // off on doing === 0 1 2
    floor: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
      index: true,
    },
    deleted: {
      type: Number,
      enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
    session: {
      type: Number,
      enum: [SESSION.EVENING, SESSION.MORNING],
      default: SESSION.MORNING,
      index: true,
    },
  },
  { collection: "requests" }
);

const requestsModel = mongoose.model("requests", requestsSchema);
module.exports = requestsModel;
