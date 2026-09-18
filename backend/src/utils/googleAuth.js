const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const getGoogleAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: [
      "openid",
      "profile",
      "email",
    ],
    prompt: "select_account",
  });
};

module.exports = {
  oauth2Client,
  getGoogleAuthUrl,
};