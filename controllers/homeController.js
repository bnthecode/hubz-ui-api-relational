import http from "../http.js";
import Drive from "../models/drive/driveModel.js";
import Home from "../models/home/homeModel.js";
import User from "../models/user/userModel.js";
import { dbHomeToUiHome } from "../parsers/home/home-parsers.js";
import { v4 as uuidv4 } from "uuid";


export const createHome = async (req, res) => {
  try {
    const { home_name, home_password, home_type } = req.body;
    const { user_id } = req;
    const foundUser = await User.findOne({ _id: user_id });
    const newHome = new Home({
      home_name,
      home_password,
      home_type,
      creator_id: user_id,
      primary_home: true,
      home_users: [user_id],
    });



    foundUser.associated_homes.push({
      primary: true,
      _id: newHome._id,
    });

    const savedHome = await newHome.save();

    await foundUser.save();
    const uiHome = dbHomeToUiHome(savedHome);

    res.status(201).send({
      home: uiHome,
      message: { content: "Successfully created home" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: {
        content: "An error occurred creating your home",
        info: error.message,
      },
    });
  }
};

export const getUserHomes = async (req, res) => {
  try {
    const { user_id } = req;
    const foundHomes = await Home.find({ home_users: user_id });
    console.log(foundHomes);
    const uiHomes = foundHomes.map((home) => dbHomeToUiHome(home));
    res.status(200).send({
      homes: uiHomes,
      message: { content: "Successfully retreived homes" },
    });
  } catch (error) {
    res.status(500).send({
      message: {
        content: "An error occurred getting homes",
        info: error.message,
      },
    });
  }
};

export const getUserHome = async (req, res) => {
  try {
    // structure data to fit per permissions
    const { home_id } = req.params;
    const foundHome = await Home.findOne({ _id: home_id }).populate(
      "home_users",
      "first_name last_name roles"
    );
    const uiHome = dbHomeToUiHome(foundHome);
    res.status(200).send({
      home: uiHome,
      message: { content: "Successfully retreived homes" },
    });
  } catch (error) {
    res.status(500).send({
      message: {
        content: "An error occurred getting homes",
        info: error.message,
      },
    });
  }
};

export const addHomeUser = async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;
    const { user_id } = req;
    const { home_id } = req.params;
    const foundHome = await Home.findOne({ _id: home_id });
    const userTempPassword = uuidv4();
    const temp_pw = `hubz_${userTempPassword}`;
    const createdUser = new User({
      first_name,
      last_name,
      username: `${foundHome.home_name}-${first_name}`,
      password: temp_pw,
      created_by: user_id,
      new: true,
    });

    createdUser.associated_homes.push({
          primary: false,
      _id: foundHome._id,
    });

    const savedUser = await createdUser.save();
    foundHome.home_users.push(savedUser._id);
    const savedHome = await foundHome.save();
    const uiHome = dbHomeToUiHome(savedHome);
    res.status(200).send({
      home: uiHome,
      temp_pw,
      message: { content: "Successfully retreived homes" },
    });
  } catch (error) {
    res.status(500).send({
      message: {
        content: "An error occurred getting homes",
        info: error.message,
      },
    });
  }
};
