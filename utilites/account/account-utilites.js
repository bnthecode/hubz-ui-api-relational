import moment from "moment";
import Cryptr from "cryptr";
import config from "../../config.js";
import { plaidAccountToUiAccount } from "../../parsers/account/account-parsers.js";

const {
  plaid: { account_encryption_key },
} = config;
const cryptr = new Cryptr(account_encryption_key);

export const getBaseAccounts = (acct, client) => {
  const decryptedToken = cryptr.decrypt(acct.account_token);
  // parse from account to ui account
  return client.getBalance(decryptedToken);
};

// export const getTransactionsForAccount = async (token, client, days = 200) => {
//     const decryptedToken = cryptr.decrypt(token);
//     const startDate = moment().subtract(days, "days").format("YYYY-MM-DD");
//     const endDate = moment().format("YYYY-MM-DD");
//     // const data = await client.getLiabilities(decryptedToken);

//     return client.getTransactions(decryptedToken, startDate, endDate, { offset: 0 })
// }

// export const enrichAccountData = async (acct, client) => {
//     const accountMeta = await getTransactionsForAccount(acct.account_token, client);
//     const uiAccount = plaidAccountToUiAccount(acct, accountMeta);
//     return uiAccount;
// }

// export const determineAccountSorter = (accounts, sort_type) => {
//     // defaulting to by type
//     // bank name not 100% working correct
//     const sortingType = sort_type === 'institution' ? 'institution' : 'subtype';

//     const sortedAccounts = accounts.reduce((acc, rootAccount) => {
//         rootAccount.total_balance = 0;

//         rootAccount.accounts.forEach(account => {
//             account.institution = rootAccount.account_name;

//             const accounts = [

//                 ...(
//                     acc[account[sortingType]] && acc[account[sortingType]].accounts ? [
//                     ...acc[account[sortingType]].accounts
//                     , account] : [account]
//                     )
//             ];

//             acc[account[sortingType]] = {
//                 ...acc[account[sortingType]],
//                 accounts,
//                 totals: getAccountTotals(accounts)
//             };

//         });

//         return acc;

//     }, { })
//     return  sortedAccounts;

// }

// const getAccountTotals = (accounts) => accounts.reduce((acc, acct) => {

//     // this shit is messed up. find a better approach to sort different accounts
//     const isCredit = acct.type === 'credit';
//     return {
//         total_available: acct.balances.available + acc.total_available,
//         total_debt: acct.balances.current + acc.total_debt,
//      };
// }, { total_available: 0, total_debt: 0 })

export const getAccessTokenForAccount = async (client, public_token) => {
  const { access_token, item_id } = await client.exchangePublicToken(
    public_token
  );
  const encrypted_acct_token = cryptr.encrypt(access_token);
  return { access_token: encrypted_acct_token, item_id };
};
