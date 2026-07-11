require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // console.log("URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;