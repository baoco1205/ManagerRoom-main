class BaseController {
  static generateMessage(res, error, data, header = 404) {
    try {
      let result = { success: !error, data };
      if (error) {
        result = {
          ...result,
          ...{
            message: error?.message ?? error,
            code: error.errno ?? error.code,
            field: error.field,
            fields: error.fields,
          },
        };
        res.status(header);
        if (
          !/^getResourceFileLocal!|(ReferenceError: resourceId)/.test(
            error.message
          )
        ) {
          debug("error when execute callback ", error);
          FileLog(error);
        }
      } else {
        res.status(200);
      }
      res.set("ContentType", "text/html;charset=UTF-8");
      res.set("CharacterEncoding", "UTF-8");
      res.json(result);
    } catch (e) {
      res.status(404);
      mail.sendMailTrackError(e);
      res.json({ success: 0, message: e.message, data: e.toString() });
      debug("error response ", e);
    }
  }
}
module.exports = BaseController;
