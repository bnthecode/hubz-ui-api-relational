export const dbUserToUiUser = (dbUser, token) => ({
  id: dbUser._id,
  token: token,
  username: dbUser.username,
  first_name: dbUser.first_name,
  last_name: dbUser.last_name,
  associated_homes: dbUser.associated_homes,
  created_by: dbUser.created_by,
  new: dbUser.new,
});
