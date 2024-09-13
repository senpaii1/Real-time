require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const mongoose = require("mongoose");
const websocket = require("./websocket");

const authRoutes = require("./routes/auth");

const User = require("./models/User");
const Message = require("./models/message");

const passport = require("passport");
require("./config/passport");

app.use(passport.initialize());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Chat app server");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
