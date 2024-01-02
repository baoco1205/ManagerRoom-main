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
      middleware: ["check.manager"],
      function: controller.createRoom.name,
      method: 2,
    },
    {
      path: apiList.getRoom,
      authRequired: 0,
      middleware: ["check.user"],
      function: controller.getRoom.name,
      method: 2,
    },
    {
      path: apiList.deleteRoom,
      authRequired: 0,
      middleware: ["check.manager"],
      function: controller.deleteRoom.name,
      method: 2,
    },
    {
      path: apiList.updateRoomStatus,
      authRequired: 0,
      middleware: ["check.manager"],
      function: controller.updateStatus.name,
      method: 2,
    },
    {
      path: apiList.updateRoom,
      authRequired: 0,
      middleware: ["check.manager"],
      function: controller.updateRoom.name,
      method: 2,
    },
  ],
  middleware: ["check.passport"],
};

module.exports = config;
