const mongoose = require("mongoose");
const conn = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Db connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};
conn();
