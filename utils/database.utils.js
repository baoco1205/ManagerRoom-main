let dbConfig = require("../const");
class databaseUtils {
  constructor() {}

  static  connect(callback) {
    return this.mongooseConnect(dbConfig, callback);
  }
  static mongooseConnect() {
    let mongoose = require("mongoose");
    mongoose.Promise = Promise;
    mongoose.connect(dbConfig.DBCONFIG.mongodb_connect_str, { useMongoClient: true });
  }
}
module.exports = databaseUtils;
