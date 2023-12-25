const response = (res, data, message) => {
  res.json({
    success: true,
    data: data,
  });
};

const responseError = (res, error, statusCode) => {
  if (statusCode) res.statusCode = statusCode;
  else res.statusCode = 404;
  return res.json({
    success: false,
    ...error, // hay error đều được
  });
};

module.exports = { response: response, responseError: responseError };
