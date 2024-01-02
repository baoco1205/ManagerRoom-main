var express = require("express");
var passport = require("passport");
// const Constant = require("../constant");
const ErrorCode = require("../error_code");
class BaseRouter {
  constructor(configFileName) {
    this.configFileName = configFileName;
    this.router = express.Router();
    this.initRouterFunction();
  }
  initRouterFunction() {
    if (this.configFileName && this.configFileName.length > 2) {
      var config = require("../config/router/" + this.configFileName);
      let { controller } = config;
      var routerControllers = config.controllers;
      for (var i = 0; i < routerControllers.length; i++) {
        let routeDetail = routerControllers[i];
        // debug('init router ' + this.configFileName + ' path:' + routeDetail.path);
        var arrParams = [];
        arrParams.push(routeDetail.path); // router path

        // check auth
        if (routeDetail.authRequired != 0) {
          arrParams.push(passport.authenticate("jwt", { session: false }));
        }

        // check middleware of router
        if (config.middleware && config.middleware.length > 0) {
          for (var rMid = 0; rMid < config.middleware.length; rMid++) {
            arrParams.push(require("../middleware/" + config.middleware[rMid]));
          }
        }

        // check middleware addtional of controller
        if (routeDetail.middleware) {
          for (var rMid = 0; rMid < routeDetail.middleware.length; rMid++) {
            arrParams.push(
              require("../middleware/" + routeDetail.middleware[rMid])
            );
          }
        }

        // target function
        if (
          routeDetail.function &&
          typeof controller[routeDetail.function] === "function"
        ) {
          const middleware = (fn) => (req, res, next) => {
            return Promise.resolve(fn(req, res, next))
              .then((result) => {
                if (!res.headersSent && result !== undefined)
                  controller.generateMessage(res, false, result);
              })
              .catch((err) => {
                if (err && err.name == "CastError") {
                  err = ErrorCode.InvalidId;
                }
                controller.generateMessage(res, err);
              });
          };
          // arrParams.push(controller[routeDetail.function]);
          arrParams.push(middleware(controller[routeDetail.function]));
        }

        this.router.all.apply(this.router, arrParams);
        // debug('init router ' + this.configFileName + ' path:' + routeDetail.path + ' success');
      }
    }

    // this.additionalController();
  }
  // additionalController() {}
}
module.exports = BaseRouter;
