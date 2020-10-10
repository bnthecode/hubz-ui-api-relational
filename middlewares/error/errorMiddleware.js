const errorMiddleware = (req, res, next) => {
  const requestErrorList = req.errors || [];

  next();
};

export default errorMiddleware;
