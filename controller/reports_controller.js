const reportsModel = require("../database/report");
const { REPORT_SENT, NOW, DELETE, CHECK_SCHEMA } = require("../const");
const response = require("./response");
const BaseController = require("./base.controller");
class reportsController extends BaseController {
  static getReport(req, res, next) {
    let { username, _id } = req.body;
    if (username || _id) {
      let dieuKienLoc = req.body;
      let condition = {};
      Object.keys(dieuKienLoc).forEach((key) => {
        condition[key] = dieuKienLoc[key];
      });
      console.log(condition);
      reportsModel
        .find(condition)
        .then((data) => {
          return response.response(res, data, "Pls try input condition");
        })
        .catch((err) => {
          return response.responseError(res, err);
        });
    } else
      reportsModel
        .find()
        .then((data) => {
          if (data.length === 0)
            return response.response(
              undefined,
              undefined,
              "Don't have condition satisfy"
            );
          return response.response(res, data);
        })
        .catch((err) => {
          return response.responseError(res, err);
        });
  }
  static myReport(req, res, next) {
    var username = req.user.username;
    reportsModel
      .find({ username: username })
      .then((data) => {
        response.response(res, data, "Get report success");
      })
      .catch((err) => {
        var error = new Error("CAN'T NOT GET YOUR REPORT" + err);
        error.statusCode = 400;
        throw error;
      });
  }
  static createReport(req, res, next) {
    // var dateCreate = new Date().toLocaleString("vi-VN");
    var dateCreate = NOW;
    let { username } = req.user;

    var { numberParty, info, contractsNumber, date } = req.body;
    CHECK_SCHEMA.CHECK_CREATE_REPORT.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        reportsModel
          .aggregate([{ $match: { dateCreate: dateCreate } }])
          .then((data) => {
            if (data) {
              return res.json({ message: "Today you already reported" });
            }
            reportsModel
              .create({
                numberParty: numberParty,
                info: info,
                contractsNumber: contractsNumber,
                username: username,
                date: date,
                dateCreate: NOW,
                deleted: DELETE.UNDELETED,
              })
              .then((data) => {
                response.response(res, data);
              });
          });
      })
      .catch((err) => {
        response.responseError(res, err, 404);
      });
  }
  static updateReport(req, res, next) {
    var { _id, numberParty, info, contractsNumber } = req.body;
    CHECK_SCHEMA.CHECK_UPDATE_REPORT_SCHEMA.validateAsync(req.body, {
      allowUnknown: false,
    })
      .then((payload) => {
        reportsModel.findById(_id).then((data) => {
          if (!data) {
            return response.response(res, data);
          }
          reportsModel
            .findByIdAndUpdate(
              _id,
              {
                numberParty: numberParty,
                info: info,
                contractsNumber: contractsNumber,
              },
              { new: true }
            )
            .then((data) => {
              return response.response(res, data);
              // return res.json({ data });
            });
        });
      })
      .catch((err) => {
        response.responseError(res, err, 404);
      });
  }
  static deleteReport(req, res) {
    var idList = req.body._id;
    //file json co dang "_id":["65363f04eb40e7088d7080b0","65363f05eb40e7088d7080b2","65363f06eb40e7088d7080b4"]
    reportsModel
      .deleteMany({ _id: { $in: idList } })
      .then((data) => {
        response.response(res, data);
      })
      .catch((err) => {
        response.responseError(res, err, 404);
      });
  }
}

module.exports = reportsController;
