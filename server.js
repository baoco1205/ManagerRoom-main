const express = require("express");
const app = express();
const { PORT } = require("./const.js");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let url = require("url");

const checkLogin = require("./middleware/check.login.js");
let appRoutesConfig = require("./config/router.json");
// catch error
app.use((err, req, res, next) => {
  var statusCode = err.statusCode;
  var message = err.messageErr;
  res.status(statusCode).json(message);
});

for (let i = 0; i < appRoutesConfig.routers.length; i++) {
  let routerItem = appRoutesConfig.routers[i];
  let RouterClass = require(routerItem.pathToFile);
  let router = new RouterClass(routerItem.configFile).router;
  app.use("/api/v1" + routerItem.path, router);
}
app.post("/api/login", checkLogin, (req, res, next) => {
  console.log("Login success");

  res.json({ data: req.user.data, token: req.user.token });
});

app.listen(PORT, () => {
  console.log("Conected at port: " + PORT);
});
