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
      method: 3,
    },
  ],
  // middleware: ["permission", "checkdata"],
};

module.exports = config;
