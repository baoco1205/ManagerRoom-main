// import apiList from "../api_list";
// import controller from "../../controller/api.controller";
// const path = require("path");
// const pathController = "api.controller.js";
const controller = require("../../controller/reports_controller");
const apiList = require("../api_list");
const config = {
  name: "reports",
  controller,
  controllers: [
    {
      path: apiList.getReport,
      authRequired: 1,
      function: controller.getReport.name,
      method: 2,
    },
    {
      path: apiList.myReport,
      authRequired: 1,
      function: controller.myReport.name,
      method: 2,
    },
  ],
  middleware: ["check.login", "check.passport"],
};

module.exports = config;
