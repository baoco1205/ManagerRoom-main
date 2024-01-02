// import apiList from "../api_list";
// import controller from "../../controller/api.controller";
// const path = require("path");
// const pathController = "api.controller.js";
const controller = require("../../controller/users.controller");
const apiList = require("../api_list");
const config = {
  name: "users",
  controller,
  controllers: [
    {
      path: apiList.createUser,
      authRequired: 1,
      function: controller.createUser.name,
      // middleware: ["check.user"],
      method: 1,
    },
    {
      path: apiList.myInfo,
      authRequired: 1,
      function: controller.myInfo.name,
      middleware: ["check.user", "check.passport"],
      method: 1,
    },
    {
      path: apiList.updateMyself,
      authRequired: 1,
      function: controller.updateMySelf.name,
      middleware: ["check.user"],
      method: 1,
    },
    {
      path: apiList.deleteUser,
      authRequired: 1,
      function: controller.softDelete.name,
      middleware: ["check.admin"],
      method: 1,
    },
    {
      path: apiList.resetPassword,
      authRequired: 1,
      function: controller.resetPassword.name,
      middleware: ["check.manager"],
      method: 1,
    },
    {
      path: apiList.update_user,
      authRequired: 1,
      function: controller.updateUser.name,
      middleware: ["check.manager"],
      method: 1,
    },
  ],
  // middleware: ["check.passport", "check.login"],
};

module.exports = config;
