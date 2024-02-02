const mongoose = require("mongoose");
require("dotenv").config();
async function connectDb(url) {
  await mongoose
    .connect(url)
    .then(() => console.log("DB connect successfully"))
    .catch((e) => {
      console.log("db connection failed :", e);
      process.exit(1);
    });
}

module.exports = connectDb;
