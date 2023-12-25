const express = require("express");
const app = express();
require("dotenv").config();
let url = require("url");
const { PORT, HOST } = require("./const.js");

let appRoutesConfig = require("./config/router.json");
for (let i = 0; i < appRoutesConfig.routers.length; i++) {
  let routerItem = appRoutesConfig.routers[i];
  let RouterClass = require(routerItem.pathToFile);
  let router = new RouterClass(routerItem.configFile).router;
  app.use(routerItem.path, router);
}
app.post("/home", (req, res, next) => {
  // console.log("base: " + req.path); // không gọi req.baseUrl được. phải gọi req.path
  res.send("HOME");
});
app.listen(PORT, () => {
  console.log("Conected at port: " + PORT);
});
