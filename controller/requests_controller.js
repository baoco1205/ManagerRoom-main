const express = require("express");
const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const mongoose = require("mongoose");
const requestModel = require("../database/request");
const { STATUS, CHECK_SCHEMA, REQUEST, SESSION, NOW } = require("../const");
const response = require("./response");
const BaseController = require("./base.controller");
class requestController extends BaseController {
  static getRequestTest(req, res, next) {
    var { key, valueKey } = req.body;
    if (key) {
      switch (key) {
        case "date": {
          requestModel
            .find({ date: valueKey })
            .then((data) => {
              res.json({ message: "GET DATA FOR DATE", data: data });
            })
            .catch((err) => {
              var error = new Error("GET REQUEST FAILS!!!: " + err);
              error.statusCode = 500;
              throw error;
            });
          break;
        }

        case "status": {
          requestModel
            .find({ status: valueKey })
            .then((data) => {
              res.json({ message: "GET DATA FOR DATE", data: data });
            })
            .catch((err) => {
              var error = new Error("GET REQUEST FAILS!!!: " + err);
              error.statusCode = 500;
              throw error;
            });
          break;
        }
      }
    } else {
      requestModel
        .find({})
        .then((data) => {
          res.json({ message: "GET REQUEST SUCCESS", data: data });
        })
        .catch((err) => {
          var error = new Error("CAN'T NOT GET YOUR REPORT" + err);
          error.statusCode = 400;
          throw error;
        });
    }
  }
  static getRequest(req, res, next) {}
  static findRequest(req, res, next) {
    const { date, session, floor, dateStart, dateEnd } = req.body;

    CHECK_SCHEMA.FIND_SCHEMA.validateAsync(req.body, { allowUnknown: false })
      .then((payload) => {
        const dieuKienLoc = req.body;
        const queryConditions = {};

        Object.keys(dieuKienLoc).forEach((key) => {
          queryConditions[key] = dieuKienLoc[key];
        });
        if (dieuKienLoc.dateStart && dieuKienLoc.dateEnd) {
          if (dieuKienLoc.dateStart > dieuKienLoc.dateEnd) {
            respose;
            return res.json({ message: "date start must before date end " });
          }
          let dateStart = new Date(dieuKienLoc.dateStart);
          let dateEnd = new Date(dieuKienLoc.dateEnd);

          queryConditions.date = {
            $gte: dateStart.toISOString(),
            $lte: dateEnd.toISOString(),
          };
          delete queryConditions.dateStart;
          delete queryConditions.dateEnd;
        }
        console.log(queryConditions);
        requestModel
          .find(queryConditions) //=> .find({session:0, date:'abcyxz'})
          .then((data) => {
            if (data.length === 0) {
              response.response(
                res,
                undefined,
                "Don't have request this time satisfy condition."
              );
            }
            response.response(res, data);
          });
      })
      .catch((err) => {
        response.responseError(res, err, 400);
      });
  }
  static isBooking(req, res, next) {
    let { session, date, floor } = req.body;
    CHECK_SCHEMA.IS_BOOKING_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        requestModel
          .findOne({ session: session, date: date, floor: floor })
          .then((data) => {
            // console.log(data);
            let isBooking = {};

            if (!data) {
              isBooking.is_Booking = true;
              return response.response(
                res,
                isBooking,
                "This booking can be order."
              );
            } else {
              isBooking.is_Booking = false;
              return response.response(res, isBooking, "Your booking is busy.");
            }
          });
      })
      .catch((err) => {
        response.responseError(res, err, 404);
      });
  }
  static createRequest(req, res, next) {
    var { date, numberCustomer, status, floor, session } = req.body;
    // date = date.split("T")[0];
    console.log(date);

    CHECK_SCHEMA.CREATE_REQUEST_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        let now = NOW;
        let checkDate = new Date(date);
        if (checkDate < NOW) {
          response.response(
            res,
            undefined,
            "The day you chose must belongs to the present or future"
          );
        }

        requestModel
          .findOne({ date: date, floor: floor, session: session })
          .then((data) => {
            if (data) {
              res.json({ message: "DUPLICATED INFO", data: data });
            } else {
              requestModel
                .create({
                  date: date,
                  numberCustomer: numberCustomer,
                  status: REQUEST.ON, //mới tạo sẽ là on, đang hoạt động là doing, hoạt động xong là off
                  floor: floor,
                  session: session,
                  deleted: 0,
                })
                .then((data) => {
                  response.response(res, data, "CREATE SUCCESS");
                });
            }
          });
      })
      .catch((err) => {
        response.responseError(res, err, 400);
      });
  }

  static deleteRequest(req, res, next) {
    var { idList } = req.body;
    requestModel
      .deleteMany({ _id: { $in: idList } })
      .then((data) => {
        response.response(res, data, "DELETE SUCCESS");
      })
      .catch((err) => {
        response.responseError(res, err, 400);
      });
  }

  static updateRequest(req, res, next) {
    CHECK_SCHEMA.UPDATEREQUESTSCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        req.body = payload;
        let { date, session, floor, _id } = req.body;
        let now = NOW;
        date = new Date(date);

        if (date < now) {
          response.response(
            res,
            undefined,
            "The chosen date must be greater than the current date. "
          );
        }

        return requestModel
          .findOne({
            _id: new mongoose.Types.ObjectId(_id),
            date,
            floor,
            session,
          })
          .then(async (data2) => {
            if (!data2) {
              return requestModel
                .findByIdAndUpdate(_id, {
                  date: date,
                  floor: floor,
                  session: session,
                })
                .then((data3) => {
                  if (!data3) {
                    response.response(res, undefined, "no record");
                  }
                  response.response(
                    res,
                    undefined,
                    "this request update success"
                  );
                });
            }
            response.response(
              res,
              undefined,
              "this request is busy, pls choose another time"
            );
          });
      })
      .catch((err) => {
        response.responseError(res, err, 400);
      });
  }

  static cancelRequest(req, res, next) {
    var { date, session, floor } = req.body;

    //////////

    CHECK_SCHEMA.CANCEL_REQUEST_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        requestModel
          .findOne({ date: date, session: session, floor: floor })
          .then((data) => {
            if (!data) {
              response.response(res, undefined, "PLS CHECK ORDER NEED CANCEL");
            }
            if (data.status != REQUEST.OFF) {
              requestModel
                .findOneAndUpdate(
                  { date: date, session: session, floor: floor },
                  { status: REQUEST.OFF }
                )
                .then((data) => {
                  console.log(data);
                  if (!data) {
                    response.response(res, undefined, "pls recheck input ");
                  }
                  response.response(res, data, "cancel success");
                });
            } else {
              response.response(res, data, "this order already cancel");
            }
          });
      })
      .catch((err) => {
        response.responseError(res, err, 400);
      });

    //////////
  }
}
module.exports = requestController;
