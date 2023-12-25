// const i18n = require('i18n')
const i18n = { __: (e) => e };
let ErrorCode = {
  OutOfRankPodium: function (e) {
    return { code: 99, message: i18n.__("OutOfRankPodium"), data: e };
  },
  MissingParams: function (e, ...field) {
    return {
      code: 100,
      message: i18n.__("MissingParams"),
      data: e || {},
      fields: [...field],
    };
  },
  MessageWithoutTranslation: function (message) {
    return { code: 1, message: message };
  },
  ValidUsername: { code: 101, message: i18n.__("ValidUsername") },
  InvalidUsername: { code: 102, message: i18n.__("InvalidUsername") },
  EmailInUse: { code: 103, message: i18n.__("EmailInUse"), field: "email" },
  PasswordIncorrect: { code: 104, message: i18n.__("PasswordIncorrect") },
  PasswordNewMissing: { code: 105, message: i18n.__("PasswordNewMissing") },
  InvalidEmail: { code: 106, message: i18n.__("InvalidEmail"), field: "email" },
  InvalidId: { code: 107, message: i18n.__("InvalidId") },
  InvalidPassword: { code: 108, message: i18n.__("InvalidPassword") },
  NotEmailFormat: {
    code: 109,
    message: i18n.__("NotEmailFormat"),
    field: "email",
  },

  UserNotFound: { code: 201, message: i18n.__("UserNotFound") },
  UserBanned: { code: 202, message: i18n.__("UserBanned") },
  UserPermissionDeny: { code: 203, message: i18n.__("UserPermissionDeny") },
  ForgotPwdEmailRequired: {
    code: 205,
    message: i18n.__("ForgotPwdEmailRequired"),
  },
  ForgotPwdTokenInvalid: {
    code: 206,
    message: i18n.__("ForgotPwdTokenInvalid"),
  },
  ForgotPwdTokenExpired: {
    code: 207,
    message: i18n.__("ForgotPwdTokenExpired"),
  },
  ForgotPwdHadChanged: { code: 208, message: i18n.__("ForgotPwdHadChanged") },

  CategoryNotFound: { code: 300, message: i18n.__("CategoryNotFound") },

  RejectOrderPermissionDeny: {
    code: 400,
    message: i18n.__(`You have don't permission to reject order`),
  },
  OrderCannotReject: { code: 401, message: i18n.__("Order cannot reject.") },
  OrderHadRejected: { code: 402, message: i18n.__("Order has been rejected.") },

  ItemNotFound: { code: 500, message: i18n.__("ItemNotFound") },
  LanguageNotFound: { code: 501, message: i18n.__("LanguageNotFound") },
  ConstructionNoWindow: { code: 502, message: "Công trình không có cửa." },
  DataLoginInvalid: { code: 600, message: "incorrect login data" },
  VersionRequired: {
    code: 601,
    message: "Version app bạn sử dụng đã cũ, vui lòng cập nhật phiên bản mới",
  },
  UndetectedDevice: {
    code: 602,
    message:
      "Không xác thực được thiết bị, vui long kiểm tra lại thiết bị hiện hành.",
  },

  ExcelConstructureFailed: { code: 700, message: "failed excel structure" },
  ObjectIdExisted: { code: 701, message: "Object Id Existed" },
  ErrorUnknown: function (e) {
    return { code: 900, message: i18n.__("ErrorUnknown"), detail: e };
  },
};

module.exports = ErrorCode;
