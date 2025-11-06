import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import getproducts from "./Services/grpc/grpc_productservice.js";
import grpc from '@grpc/grpc-js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Loaded .env from:", path.resolve(__dirname, "../.env"));
console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_REGION:", process.env.AWS_REGION);

const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./db/connectDB.js");

//grpc services 
const grpcProductService = getproducts()
grpcProductService.bindAsync("0.0.0.0:5000" ,grpc.ServerCredentials.createInsecure() , (error , port)=>{
  if(error) console.log("Error in connecting grpc service " , error)
  console.log("grpc service connected" , port)
})

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    const server = app.listen(PORT);

    server.on("listening", () => {
      console.log(`App is listening on port ${PORT}`);
    });

    server.on("error", (err: Error) => {
      console.error("Server error occurred:", err);
    });

    server.on("close", () => {
      console.warn("Server connection closed !!");
    });
  })
  .catch((err: Error) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });