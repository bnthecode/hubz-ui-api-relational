export const getAuthHeaders = (req) =>
  req.get("Authorization") ? req.get("Authorization").split(" ")[1] : "";

export const buildReqUser = (token, req, next) => {
  const { user } = token;
  req.user_id = user._id;
  (req.username = user.username), next();
};
