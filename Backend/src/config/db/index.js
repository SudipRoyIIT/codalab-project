// import mongoose from "mongoose";
// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// const { DB_USER, DB_PASS } = process.env;
// console.log(process.env)
// // Ensure that the environment variable DB_URL is defined in your .env file
// const url = `mongodb+srv://${DB_USER}:${DB_PASS}@codasr.0mfqyji.mongodb.net/`;

// const connect = async () => {
//   try {
//     await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log("Mongoose connected successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// };

// export { connect, url };

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// ✅ Always use single MONGO_URI from .env
const url = process.env.MONGO_URI;

// ✅ Main function that connects the whole backend to DB
const connect = async () => {
  try {
    if (!url) {
      console.error("❌ MONGO_URI missing in .env file");
      return;
    }

    await mongoose.connect(url);
    console.log("✅ Mongoose connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
  }
};

// ✅ Export both so controllers using { url } do not break
export { connect, url };