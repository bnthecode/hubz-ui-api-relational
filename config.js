import dotEnv from "dotenv";
dotEnv.config();

const config = {
  server: {
    port: 8080,
  },
  http: {
    timeout: 10000,
    base_url: process.env.NODE_BASE_URL || "http://localhost:8080/api",
    withCredentials: process.env.AUTH_ENABLED === "true",
  },
  home: {
    home_encryption_key: process.env.HOME_ENCRYPTION_KEY || "",
  },
  auth: {
    auth_enabled: process.env.AUTH_ENABLED === "true",
    allowedOrigins: process.env.FRONT_END_URL,
    jwt: {
      jwt_encryption_key: process.env.JWT_ENCRYPTION_KEY,
      jwt_config: {
        algorithm: "HS256",
        expiresIn: 20000,
      },
    },
    cookie: {
      cookie_name: "brandons-applicaion-session",
      cookie_config: {
        maxAge: 24 * 60 * 60,
        httpOnly: true,
        secure: false,
      },
    },
  },
  aws: {
    bucket_name: process.env.BUCKET_NAME,
    iam_user_key: process.env.IAM_USER_KEY,
    iam_user_secret: process.env.IAM_USER_SECRET,
  },
  database: {
    connection_string: process.env.DATABASE_CONNECTION_STRING,
    database_config: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  plaid: {
    client_id: process.env.PLAID_CLIENT_ID || "",
    client_secret: process.env.PLAID_CLIENT_SECRET || "",
    account_encryption_key: process.env.PLAID_ENCRYPTION_KEY,
  },
};

export default config;
