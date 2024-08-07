const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userApi = require("./routes/user.js");

require("dotenv").config();
require("./conn/conn.js");
app.use(express.json());
app.use(cookieParser);

// routes //
app.get("/sex", (req, res) => {
  console.log("hlello");
  res.send("Server is running!");
});
app.use("/api/v1", userApi);

app.listen(process.env.PORT, () =>
  console.log(`app started on port ${process.env.PORT}`)
);
