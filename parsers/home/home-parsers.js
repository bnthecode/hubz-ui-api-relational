export const dbHomeToUiHome = (dbHome) => ({
  id: dbHome._id,
  home_type: dbHome.home_type,
  home_name: dbHome.home_name,
  drive_id: dbHome.drive_id,
  home_users: dbHome.home_users,
});
