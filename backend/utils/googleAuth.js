// utils/googleAuth.js
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.verifyGoogleToken = async (credential) => {
  if (!credential) {
    throw new Error("Google credential is required");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid Google token payload");
  }

  const {
    sub,
    email,
    email_verified,
    name,
    picture,
    given_name,
    family_name,
  } = payload;

  if (!sub || !email) {
    throw new Error("Google account is missing required data");
  }

  return {
    googleId: sub,
    email: email.toLowerCase(),
    emailVerified: !!email_verified,
    name: name || [given_name, family_name].filter(Boolean).join(" ").trim(),
    profilePhoto: picture || null,
    raw: payload,
  };
};