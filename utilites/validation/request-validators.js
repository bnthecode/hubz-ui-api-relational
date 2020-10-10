import validationTypes from "./validation-types.js";
import validationItems from "./validation-items.js";

const getErrorList = (item, input) => {
  const errorItems = [];
  item.rules.forEach((rule) => {
    const operationType = Object.keys(rule)[0];
    const operationLimit = rule[operationType];
    const operatorFunc = validationTypes[operationType];
    const passes = operatorFunc(input, operationLimit);
    if (passes) return true;
    else
      errorItems.push({
        content: rule.validationMessage,
        info: "Validation Error",
      });
  });
  return errorItems;
};

const getValidationResult = (validationItems, body) =>
  validationItems.reduce((acc, item) => {
    const field = body[item.key];
    const errItems = item.rules && field ? getErrorList(item, field) : [];
    const inputPassesValidation = field && item.rules && errItems.length < 1;
    if (!field) acc.push({ content: item.message, info: "Validation Error" });
    return !inputPassesValidation ? [...acc, ...errItems] : acc;
  }, []);

const userValidators = {
  createUserValidation: (req, res, next) => {
    const { user } = req.body;
    const validationResult = getValidationResult(
      validationItems.user.createUser,
      user
    );
    return validationResult.length
      ? res.status(500).send({ messages: validationResult })
      : next();
  },
};

export const requestValidators = {
  users: userValidators,
};
