import config from "../../config.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserNotFound, UserExists } from "../../errors/userErrors.js";
import User from "../../models/user/userModel.js";

const {
  auth: { jwt, cookie },
} = config;

const { jwt_encryption_key, jwt_config } = jwt;
const { cookie_name, cookie_config } = cookie;

export const getUserCredentials = (user) => {
  const token = jsonwebtoken.sign({ user }, jwt_encryption_key, jwt_config);
  const cookie = { cookie_name, cookie_config };
  return { token, cookie };
};

export const hashPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

export const comparePassword = async (initPwd, comparee) => {
  const passwordsMatch = await bcrypt.compare(initPwd, comparee);
  console.log(passwordsMatch);
  if (!passwordsMatch) throw new UserNotFound();
  else return true;
};

export const checkUserDoesNotExist = async (username) => {
  const foundUser = await User.findOne({ username });
  if (foundUser) throw new UserExists();
};

export const checkUserExists = async (username) => {
  const foundUser = await User.findOne({ username });
  if (!foundUser) throw new UserNotFound();
  else return foundUser;
};

export const findUserByAccessKey = async (password) => {
  const foundUser = await User.findOne({ password });
  if (!foundUser) throw new Error({ message: "access_token invalid" });
  else return foundUser;
};
