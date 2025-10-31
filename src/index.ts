
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connectDB.js";


import app from "./app.js";     
const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(` App is listening on port ${PORT}`);
    });

    server.on("error", (err: Error) => {
      console.error("Server error occurred:", err);
    });

    server.on("close", () => {
      console.warn("Server connection closed!");
    });
  })
  .catch((err: Error) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
