import User from "../models/user/userModel.js";
import {
  getUserCredentials,
  comparePassword,
  hashPassword,
  checkUserExists,
  checkUserDoesNotExist,
  findUserByAccessKey,
} from "../utilites/user/user-utilities.js";
import { dbUserToUiUser } from "../parsers/user/ui-parsers.js";

export const createUser = async (req, res) => {
  try {
    const { user: newUser } = req.body;
    await checkUserDoesNotExist(newUser.username);
    const encryptedPassword = await hashPassword(newUser.password);
    const createdUser = new User({
      ...newUser,
      password: encryptedPassword,
      new: true,
    });

    const user = await createdUser.save();
    const { cookie, token } = getUserCredentials(user);
    const uiUser = dbUserToUiUser(user, token);
    res.cookie(cookie.cookie_name, token, { ...cookie.cookie_config });
    res.status(201).send({
      user: { ...uiUser, new: true },
      message: { content: "Successfully created user" },
    });
    
  } catch (error) {
    res.status(500).send({
      message: {
        content: "An error occured creating user",
        info: error.message,
      },
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await checkUserExists(username);
    if (user.new) {
      user.new = false;
      user = await user.save();
    }
    await comparePassword(password, user.password);
    const { cookie, token } = getUserCredentials(user);
    const uiUser = dbUserToUiUser(user, token);
    res.cookie(cookie.cookie_name, token, { ...cookie.cookie_config });
    res.status(200).send({
      user: uiUser,
      message: { content: "Successfully retreived user" },
    });
  } catch (error) {
    res.status(500).send({
      message: {
        content: "An error occured getting user",
        info: error.message,
      },
    });
  }
};

export const updateUserByAccessKey = async (req, res) => {
  try {
    const { access_key, username, password, first_name, last_name } = req.body;
    const user = await findUserByAccessKey(access_key);
    user.username = username;
    // TO DO NO ENCRYPTED PASSWORD FOR NEW USER
    user.password = password;
    user.first_name = first_name;
    user.last_name = last_name;
    await user.save();
    const { cookie, token } = getUserCredentials(user);
    const uiUser = dbUserToUiUser(user, token);
    res.cookie(cookie.cookie_name, token, { ...cookie.cookie_config });
    res.status(200).send({
      user: uiUser,
      message: { content: "Successfully retreived user" },
    });
  } catch (error) {
    res.status(500).send({
      message: {
        content: "An error occured getting user",
        info: error.message,
      },
    });
  }
};

export const uploadProfileImg = async (req, res) => {
  res.status(500).send({
    message: {
      content: "An error occured creating image",
      info: error.message,
    },
  });
};

export const getUsernameAvailable = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  res.status(200).send({ exists: user ? true : false });
};
