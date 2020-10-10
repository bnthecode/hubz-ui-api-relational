export const httpDevMiddleware = (req, res, next) => {
  req.user = {
    username: "Dev",
    password: "dev",
    email: "dev@dev.com",
    _id: "5f2a9efd9de99f72bc27a71b",
  };
  next();
};
