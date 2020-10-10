import config from "../../config.js";
import jsonwebtoken from "jsonwebtoken";
import { getUserCredentials } from "../../utilites/user/user-utilities.js";
import {
  getAuthHeaders,
  buildReqUser,
} from "../../utilites/auth/auth-utilities.js";

const {
  auth: { jwt, cookie },
} = config;
const { jwt_encryption_key } = jwt;

export const httpAuthMiddleware = async (req, res, next) => {
  try {
    if (req.originalUrl !== "/api/users" && req.originalUrl !== "/api/login" && req.originalUrl !== "/api/users/access_key") {
      const token = getAuthHeaders(req);
      const decodedToken = jsonwebtoken.verify(token, jwt_encryption_key);
      return buildReqUser(decodedToken, req, next);
    }
    next();
  } catch (error) {
    // just create another session
    if (error.message === "jwt expired") {
      const oldToken = getAuthHeaders(req);
      const decodedToken = jsonwebtoken.decode(oldToken);
      const { token, cookie } = getUserCredentials(decodedToken);
      res.cookie(cookie.cookie_name, token, { ...cookie.cookie_config });
      return buildReqUser(decodedToken, req, next);
    }
    res
      .status(401)
      .send({
        message: { content: "Authorization failed", info: error.message },
      });
  }
};
