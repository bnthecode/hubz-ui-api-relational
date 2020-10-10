export const toUiAccount = (account) => ({
  account_name: account.account_name,
  id: account.id,
  accounts: account.accounts,
  transactions: account.transactions,
});

export const plaidAccountToUiAccount = (dbAccount, plaidAccount) => {
  // database obj stores limited info
  // plaid holds all meta data
  // join the two together and form a ui account object
  const joinedObject = {
    account_name: dbAccount.account_name,
    id: dbAccount._id,
    accounts: plaidAccount.accounts,
    transactions: plaidAccount.transactions,
  };
  return toUiAccount(joinedObject);
};
