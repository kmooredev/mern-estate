class CustomError extends Error {
  statusCode: number | any;
}

const errorHandler = (statusCode: number | any, message: string) => {
  const error = new CustomError();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

export default errorHandler;
