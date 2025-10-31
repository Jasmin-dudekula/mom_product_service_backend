import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/connectDB.js";

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    const server = app.listen(PORT);

    server.on("listening", () => {
      console.log(`app is listening on port ${PORT}`);
    });

    server.on("error", (err:Error) => {
      console.error("server error occured: ", err);
    });

    server.on("close", () => {
      console.warn("server connection closed !!");
    });
  })
  .catch((err:Error) => {
    console.error("mongodb connection failed : ", err);
    process.exit(1);
  });
