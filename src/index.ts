import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/DBConnect.js";

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    const server = app.listen(PORT);

    server.on("listening", () => {
      console.log(`app is listening on port ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("server error occured: ", err);
    });

    server.on("close", () => {
      console.warn("server connection closed !!");
    });
  })
  .catch((err) => {
    console.error("mongodb connection failed : ", err);
    process.exit(1);
  });
