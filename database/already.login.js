const mongoose = require("mongoose");
const database = "MANAGER_ROOM";
const ip = "127.0.0.1:27017";
const { DELETE, ROLE } = require("../const");
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const alreadySchema = new Schema(
  {
    token: String,
    time: Date,
    dateCreate: Date,
    deleted: {
      type: Number,
      enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
  },
  { collection: "already.login" }
);
const alreadyModel = mongoose.model("already.login", alreadySchema);
module.exports = alreadySchema;
