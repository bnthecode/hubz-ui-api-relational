import router from "./router.js";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { httpAuthMiddleware } from "./middlewares/http/auth.js";
import config from "./config.js";
import { httpDevMiddleware } from "./middlewares/http/dev.js";
import mongoose from "mongoose";
const {
  auth: { auth_enabled, allowedOrigins },
  database: { connection_string, database_config },
  server: { port },
  server: rootConfig,
} = config;
import fileupload from "express-fileupload";
const app = express(rootConfig);
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(
  cors({
    credentials: auth_enabled,
    origin: allowedOrigins,
  })
);
app.use(fileupload());

if (auth_enabled) {
  app.use("/api", httpAuthMiddleware, router);
} else {
  app.use("/api", httpDevMiddleware, router);
}

try {
  mongoose.connect(connection_string, { ...database_config });
} catch (error) {
  console.log(error);
}

server.listen(port, () => {
  console.log(`Hubz api running on port ${port}`);
});
