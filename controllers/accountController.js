import plaid from "plaid";
import Account from "../models/account/accountModel.js";
import User from "../models/user/userModel.js";
import {
  getAccessTokenForAccount,
  getBaseAccounts,
} from "../utilites/account/account-utilites.js";
import config from "../config.js";
import Home from "../models/home/homeModel.js";

const {
  plaid: { client_id, client_secret },
} = config;
const client = new plaid.Client({
  clientID: client_id,
  secret: client_secret,
  env: plaid.environments.development,
  options: {
    version: "2019-05-29",
  },
});

export const createAccount = async (req, res) => {
  try {
    const { account } = req.body;
    const { home_id } = req.params;
    const { user_id } = req;
    const foundUser = await User.findOne({ _id: user_id });
    const foundHome = await Home.findOne({ _id: home_id });
    const newAcct = new Account({
      user_id,
      home_id,
      account_token: account.token,
      account_name: account.name,
    });
    await newAcct.save();
    foundHome.accounts.push(newAcct._id);
    foundUser.accounts.push(newAcct._id);
    await foundUser.save();
    await foundHome.save();
    await getAccounts(req, res);
  } catch (error) {
    res
      .status(500)
      .send({
        message: {
          content: "An error occurred creating your account",
          info: error.message,
        },
      });
  }
};

export const getAccounts = async (req, res) => {
  const { home_id } = req.params;
  try {
    const foundAccounts = await Account.find({ home_id });
    const uiAccounts = await Promise.all(
      foundAccounts.map((acct) => getBaseAccounts(acct, client))
    );
    res
      .status(200)
      .send({
        accounts: uiAccounts,
        message: { content: "Successfully pulled accounts" },
      });
  } catch (error) {
    res
      .status(500)
      .send({
        message: {
          content: "An error occured getting accounts",
          info: error.message,
        },
      });
  }
};

export const getAccountTransactions = async (req, res) => {
  // by account id
  const { home_id } = req.params;
  const { sort_type } = req.query;

  // try {
  //     const foundAccounts = await Account.find({ home_id });

  //     // refactor, pull just account info from plaid fetch transactions later
  //     const uiAccounts = await Promise.all(foundAccounts.map(acct => enrichAccountData(acct, client)));

  //     const formattedAccounts = determineAccountSorter(uiAccounts, sort_type);
  //     res.status(200).send({ accounts: formattedAccounts, message: { content: 'Successfully pulled accounts' } })
  // }
  // catch (error) {
  //     res.status(500).send({ message: { content: 'An error occured getting accounts', info: error.message } })

  // }
};

export const getAccountToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    const { access_token } = await getAccessTokenForAccount(
      client,
      public_token
    );
    res
      .status(200)
      .send({
        access_token,
        message: { content: "Successfully created token" },
      });
  } catch (error) {
    res
      .status(500)
      .send({
        message: {
          content: "an error occurred getting your account credentials",
          info: error.message,
        },
      });
  }
};
