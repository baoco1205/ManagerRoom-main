// import apiList from "../api_list";
// import controller from "../../controller/api.controller";
// const path = require("path");
// const pathController = "api.controller.js";
const controller = require("../../controller/room.controller");
const apiList = require("../api_list");
const config = {
  name: "rooms",
  controller,
  controllers: [
    {
      path: apiList.createRoom,
      authRequired: 0,
      function: controller.createRoom.name,
      method: 2,
    },
  ],
  // middleware: ["permission", "checkdata"],
};

module.exports = config;
