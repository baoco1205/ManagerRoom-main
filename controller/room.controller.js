const roomsModel = require("../database/room");
const Joi = require("@hapi/joi");
//const
const { CHECK_SCHEMA } = require("../const");
const BaseController = require("./base.controller");
const response = require("./response");

/////
class roomController extends BaseController {
  static getRoom(req, res) {
    const dieuKienLoc = req.body;
    const queryConditions = {};
    Object.keys(dieuKienLoc).forEach((key) => {
      queryConditions[key] = dieuKienLoc[key];
    });
    roomsModel
      .find(queryConditions)
      .then((data) => {
        response.response(res, data);
      })
      .catch((err) => {
        response.responseError(res, err, 405);
      });
  }
  static createRoom(req, res) {
    var { roomSize, numberCustomer, floor } = req.body;

    //status có 2 dạng free =0 or doing =1
    CHECK_SCHEMA.CREATE_ROOM_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        roomsModel
          .create({
            roomSize: roomSize,
            numberCustomer: numberCustomer,
            floor: floor,
            status: 0,
            deleted: 0,
          })
          .then((data) => {
            var id = data._id;
            res.json({ message: "Create room complete!!", id: id });
          });
      })
      .catch((err) => {
        var error = new Error(err);
        error.statusCode = 400;
        throw error;
      });
  }

  static updateRoom(req, res) {
    ////////

    var roomSchema = Joi.object({
      roomSize: Joi.number().max(30).required(),
      numberCustomer: Joi.number().required(),
      floor: Joi.number().min(1).max(50).required(),
      status: Joi.number().min(0).max(1).required(),
      id: Joi.string().required(),
    });
    try {
      const { error } = roomSchema.validate(req.body, { allowUnknown: false });
      if (error) {
        // Nếu có lỗi, trả về mã lỗi 400 và thông báo lỗi
        return res.status(400).json({ message: error.message });
      }
    } catch (err) {
      var error = new Error(err);
      error.statusCode = 400;
      throw error;
    }

    ////////
    var { roomSize, numberCustomer, floor, status, id } = req.body;
    roomsModel
      .findByIdAndUpdate(
        id,
        {
          roomSize: roomSize,
          numberCustomer: numberCustomer,
          floor: floor,
          status: status,
        },
        { new: false }
      )
      .then((data) => {
        if (data) {
          res.json({ message: "UPDATE SUCCESS", data: data });
        } else {
          console.log(data);
          res.status(400).json("UPDATE FAILS");
        }
      })
      .catch((err) => {
        var error = new Error(err);
        error.statusCode = 400;
        throw error;
      });
  }
  static deleteRoom(req, res) {
    var id = req.body._id;
    roomsModel
      .findByIdAndDelete({ _id: id })
      .then((data) => {
        if (data) {
          res.json({ message: "DELETE SUCCESS", data: data });
        } else {
          res.json({ message: "PLS CHECK ID" });
        }
      })
      .catch((err) => {
        const error = new Error();
      });
  }
  static updateStatus(req, res) {
    var { id, status } = req.body;
    //////
    var updateRoomSchema = Joi.object({
      status: Joi.number().min(0).max(1).required(),
      id: Joi.string().required(),
    });
    try {
      const { error } = updateRoomSchema.validate(req.body, {
        allowUnknown: false,
      });
      if (error) {
        // Nếu có lỗi, trả về mã lỗi 400 và thông báo lỗi
        return res.status(400).json({ message: error.message });
      }
    } catch (err) {
      var error = new Error(err);
      error.statusCode = 400;
      throw error;
    }
    //////
    let fillterCondition = req.body;
    let query = {};
    Object.keys(fillterCondition).forEach((key) => {
      console.log(key);
      query[key] = fillterCondition[key];
    });
    roomsModel
      .findByIdAndUpdate({ _id: id }, { status: status })
      .then((data) => {
        if (data) {
          console.log(data);
          response.response(res, data);
        } else {
          response.responseError(res, { message: "ID does not exist" });
        }
      })
      .catch((err) => {
        var error = new Error(err);
        error.statusCode = 400;
        throw error;
      });
  }
}
/////

module.exports = roomController;
