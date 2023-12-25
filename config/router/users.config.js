// import apiList from "../api_list";
// import controller from "../../controller/api.controller";
// const path = require("path");
// const pathController = "api.controller.js";
const checkPassports = require("../../middleware/check.passport")
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
      method: 1,
    },
    {
      path: apiList.myInfo,
      authRequired: 1,
      function: controller.myInfo.name,
      method: 1,
    },
    {
      path: apiList.updateMyself,
      authRequired: 1,
      // function: controller.getResourceFileLocalNoAuthen.name,
      method: 1,
    },
    {
      path: apiList.deleteUser,
      authRequired: 1,
      // function: controller.getResourceFileLocalNoAuthen.name,
      method: 1,
    },
  ],
  middleware: ["check.login", "checkdata"],
};

module.exports = config;
