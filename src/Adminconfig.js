// Admin can sign in with a full email (admin@gmail.com) or a simple username.
// A username without "@" is turned into  <username>@aaifoods.app
export const ADMIN_DOMAIN = "aaifoods.app";
export const toEmail = (value) => {
  const v = value.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@${ADMIN_DOMAIN}`;
};
export const toUsername = (email = "") => email;