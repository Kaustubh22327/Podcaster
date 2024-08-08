const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userApi = require("./routes/user.js");
const categoryApi = require("./routes/categories.js");
const podcastApi = require("./routes/podcast.js");
require("dotenv").config();
require("./conn/conn.js");

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/api/v1", userApi);
app.use("/api/v1", categoryApi);
app.use("/api/v1", podcastApi);
app.listen(process.env.PORT, () =>
  console.log(`App started on port ${process.env.PORT}`)
);
