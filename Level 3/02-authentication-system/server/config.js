const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const jwtSecret = process.env.JWT_SECRET?.trim();
const mongoUri = process.env.MONGO_URI?.trim();

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing from server/.env");
}

if (!mongoUri) {
  throw new Error("MONGO_URI is missing from server/.env");
}

module.exports = {
  jwtSecret,
  mongoUri,
  port: process.env.PORT || 5002,
};