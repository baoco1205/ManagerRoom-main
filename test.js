let events = require("events");
let event = new events();
event.on("error", () => {
  console.log("xu ly loi o day");
});

event.emit("error");
