const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

const connectDb=require("./config/database");
connectDb(process.env.MONGODB_URL);

const user = require("./routes/user");
app.use(express.json());
app.use("/api/v1", user);
app.listen(PORT, () => console.log(`server is running on ${PORT}`));
