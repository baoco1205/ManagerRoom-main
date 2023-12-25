const roomsModel = require("../database/room");
const Joi = require("@hapi/joi");
//const
const { CHECKSCHEMA } = require("../const");
const BaseController = require("./base.controller");

/////
class roomController extends BaseController {
  static getRoom(req, res) {
    var { status, roomSize } = req.body;
    if ((status, roomSize)) {
      roomsModel
        .find({ status: status, roomSize: { $lt: `${roomSize}` } })
        .then((data) => {
          return res.json({ message: "Get success", data: data });
        })
        .catch((err) => {
          let error = new Error(err);
          error.statusCode = 403;
          throw error;
        });
    } else if (status) {
      roomsModel
        .find({ status: status })
        .then((data) => {
          return res.json({ message: "Get success status", data: data });
        })
        .catch((err) => {
          let error = new Error(err);
          error.statusCode = 403;
          throw error;
        });
    } else if (roomSize) {
      roomsModel
        .find({ roomSize: roomSize })
        .then((data) => {
          return res.json({ message: "Get success roomsize", data: data });
        })
        .catch((err) => {
          let error = new Error(err);
          error.statusCode = 403;
          throw error;
        });
    } else {
      roomsModel
        .find()
        .then((data) => {
          res.json({ Message: "GET ALL ROOM SUCCESS", data: data });
        })
        .catch((err) => {
          var error = new Error();
          error.statusCode = 400;
          throw error;
        });
    }
  }
  static createRoom(req, res) {
    var { roomSize, numberCustomer, floor } = req.body;

    //status có 2 dạng free =0 or doing =1
    CHECKSCHEMA.CREATEROOMSCHEMA.validateAsync(req.body, {
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
        var error = new Error();
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
    console.log("aaaaaaaaaa" + id);
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
    roomsModel
      .findByIdAndUpdate({ _id: id }, { status: status })
      .then((data) => {
        console.log(data);
        res.json({ message: "UPDATE STATUS SUCCESS", data: data });
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
