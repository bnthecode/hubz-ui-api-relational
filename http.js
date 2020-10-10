import axios from "axios";
import config from "./config.js";

const {
  http: { withCredentials, timeout, base_url },
} = config;

const httpConfig = axios.create({
  withCredentials,
  timeout,
});

httpConfig.interceptors.request.use((req) => {
  req.baseURL = base_url;
  return req;
});

httpConfig.interceptors.response.use(
  (response) => {
    // we can determine to display from server, if message, display
    // all methods have a message back atm
    return response;
  },
  (error) => {
    throw error;
  }
);

export default httpConfig;
