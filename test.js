const controller = require("./controller/users.controller");
const config = {
  name: "users",
  controller,
  controllers: [
    {
      authRequired: 1,
      function: controller.createUser.name,
      method: 1,
    },
  ],
};
let nameF = config.controllers[0].function;
console.log(nameF);
let func = config.controller[nameF];
console.log(func);

function middleware(fn) {
  function async(req, res, next) {
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
  }
}
