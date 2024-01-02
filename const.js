const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const HOST = process.env.URL_CLIENT;

const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
let DBCONFIG = require("./config/database");

const KEY_TOKEN = { keyToken: "keyToken2" };
const ROLE = {
  CUSTOMER_ROLE: 0,
  USER: 1,
  MANAGER: 2,
  ADMIN: 3,
};
const DELETE = {
  UNDELETED: 0,
  DELETED: 1,
};
const ROOM = {
  OPEN: 0,
  CLOSE: 1,
};
const REQUEST = {
  OFF: 0,
  ON: 1,
  DOING: 2,
};
const SESSION = { MORNING: 0, EVENING: 1 };
//Map<Object,Object> maps = {'key':value}
const CHECK_SCHEMA = {
  CREATE_REQUEST_SCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(0, 1).required(),
    numberCustomer: Joi.number().required(),
    // status: Joi.number().required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
  }),
  CHECK_CREATE_REPORT: Joi.object({
    numberParty: Joi.number().required(),
    info: Joi.string().max(300),
    contractsNumber: Joi.number().required(),
    date: Joi.date().format("YYYY-MM-DD"),
  }),
  UPDATE_REQUEST_SCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(SESSION.MORNING, SESSION.EVENING).required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
    _id: Joi.string().required(),
  }),
  CANCEL_REQUEST_SCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(0, 1).required(),
    // status: Joi.number().required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
    status: Joi.number().valid(0, 1, 2),
  }),
  CREATE_ROOM_SCHEMA: Joi.object({
    roomSize: Joi.number().max(30).required(),
    numberCustomer: Joi.number().required(),
    floor: Joi.number().min(1).max(50).required(),
  }),
  CREATE_USER_SCHEMA: Joi.object({
    username: Joi.string().alphanum().min(6).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    role: Joi.number().valid(1, 2, 3).default(1),
    name: Joi.string()
      .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/)
      .required(),
    address: Joi.string().alphanum().min(3).max(100).optional(),
    note: Joi.string().alphanum().max(500).optional(),
  }),
  CHECK_ID: Joi.object({
    _id: Joi.string()
      .regex(/^[a-zA-Z0-9]{24}$/)
      .required(),
  }),
  UPDATE_USER_SCHEMA: Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    role: Joi.number().valid(1, 2).default(1),
    name: Joi.string()
      .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/)
      .required(),
    address: Joi.string().alphanum().min(3).max(100).optional(),
    note: Joi.string().alphanum().max(500).optional(),
    id: Joi.string().alphanum().max(500).required(),
  }),
  UPDATE_MYSELF_SCHEMA: Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    role: Joi.number().valid(1, 2).default(1),
    name: Joi.string()
      .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/)
      .required(),
    address: Joi.string().alphanum().min(3).max(100).optional(),
    note: Joi.string().alphanum().max(500).optional(),
  }),
  FIND_SCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD"),
    dateStart: Joi.date().format("YYYY-MM-DD").required(),
    dateEnd: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(SESSION.MORNING, SESSION.EVENING),
    floor: Joi.number().valid(1, 2, 3, 4, 5),
    _id: Joi.string(),
    status: Joi.string().valid(REQUEST.OFF, REQUEST.ON, REQUEST.DOING),
  }),
  IS_BOOKING_SCHEMA: Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(SESSION.MORNING, SESSION.EVENING).required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
  }),
  CHECK_UPDATE_REPORT_SCHEMA: Joi.object({
    _id: Joi.string().required(),
    numberParty: Joi.number().min(1).max(1000),
    info: Joi.string(),
    contractsNumber: Joi.number().max(40),
  }),
};
const REPORT_SENT = {
  UNSENT: 0,
  SENT: 1,
};

const whitelist = ["http://localhost:3000"];
const CORS_OPTIONS = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log(origin);
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

//CO XU LY
//DATE
var dateCreate = new Date();
var localizedDateString = dateCreate.toLocaleString("vi-VN");
var dateFromLocalized = new Date(localizedDateString);
dateFromLocalized.setHours(dateFromLocalized.getHours() + 7);
// console.log(dateFromLocalized.toISOString());
const NOW = dateFromLocalized;
///////

module.exports = {
  CORS_OPTIONS,
  PORT,
  KEY_TOKEN,
  ROLE,
  DELETE,
  ROOM,
  REQUEST,
  SESSION,
  CHECK_SCHEMA,
  NOW,
  REPORT_SENT,
  PORT,
  HOST,
  DBCONFIG,
};
