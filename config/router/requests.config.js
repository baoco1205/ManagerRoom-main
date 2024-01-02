// import apiList from "../api_list";
// import controller from "../../controller/api.controller";
// const path = require("path");
// const pathController = "api.controller.js";
const controller = require("../../controller/requests_controller");
const apiList = require("../api_list");
const config = {
  name: "requests",
  controller,
  controllers: [
    {
      path: apiList.createRequest,
      authRequired: 0,
      function: controller.createRequest.name,
      middleware: [],
      method: 1,
    },
    {
      path: apiList.findRequest,
      authRequired: 0,
      function: controller.findRequest.name,
      middleware: [],
      method: 1,
    },
    {
      path: apiList.cancelRequest,
      authRequired: 0,
      function: controller.cancelRequest.name,
      middleware: [],
      method: 1,
    },
    {
      path: apiList.isBooking,
      authRequired: 0,
      function: controller.isBooking.name,
      middleware: [],
      method: 1,
    },
    {
      path: apiList.updateRequest,
      authRequired: 0,
      function: controller.updateRequest.name,
      middleware: [],
      method: 1,
    },
    {
      path: apiList.deleteRequest,
      authRequired: 0,
      function: controller.deleteRequest.name,
      middleware: [],
      method: 1,
    },
  ],
  // middleware: ["permission", "checkdata"],
};

module.exports = config;
