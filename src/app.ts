// const express=require("express")
// const cors = require('cors')

// class App{
//     constructor(){
//         this.app=express();
//         this.app.use(cors())
//     }
//     routes(){
//         this.app.use("/",(req,res)=>{
//             res.json({msg:"your server is ready"})
//         })
//     }
//     middlewares(){
//          this.app.use(express.json());
//     }
//     listen(port){
//         this.app.listen(port,()=>{
//             console.log(`app is running at http://localhost:${port}`)
//         })
//     }
// }
// module.exports=App


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import ApiResponse from "./utils/ApiResponse.js";
import ApiError from "./utils/ApiError.js";
import { type Request, type Response, type NextFunction } from "express";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught by middleware:", err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, {}, err.message));
  }

  // Handle unexpected errors
  return res.status(500).json(new ApiError(500, "internal server error", err));
});

export default app;
