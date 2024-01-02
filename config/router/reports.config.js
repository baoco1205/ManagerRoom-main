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
      middleware: ["check.manager"],
      method: 1,
    },
    {
      path: apiList.myReport,
      authRequired: 1,
      function: controller.myReport.name,
      method: 1,
    },
    {
      path: apiList.createReport,
      authRequired: 1,
      function: controller.createReport.name,
      method: 1,
    },
    {
      path: apiList.deleteReport,
      authRequired: 1,
      function: controller.deleteReport.name,
      middleware: ["check.manager"],
      method: 1,
    },
    {
      path: apiList.updateReport,
      authRequired: 1,
      function: controller.updateReport.name,
      method: 1,
    },
  ],
  middleware: ["check.passport"],
};

module.exports = config;
