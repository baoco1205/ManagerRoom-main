
const mongoose = require("mongoose");
const database = "MANAGER_ROOM";

const ip = "127.0.0.1:27017";
const { DELETE, ROLE, ROOM } = require("../const");
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const roomsSchema = new Schema(
  {
    roomSize: {
      type: Number,
      // enum: [],
      default: 0,
      index: true,
    },
    numberCustomer: {
      type: Number,
      // enum: [],
      default: 0,
      index: true,
    },
    floor: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
      index: true,
    },
    status: {
      type: Number,
      enum: [ROOM.OPEN, ROOM.CLOSE],
      default: ROOM.OPEN,
      index: true,
    },
    deleted: {
      type: Number,
      enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
  },
  { collection: "rooms" }
);
const roomsModel = mongoose.model("rooms", roomsSchema);
module.exports = roomsModel;
