
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import ApiResponse from "./utils/ApiResponse.js";
import ApiError from "./utils/ApiError.js";
import { type Request, type Response, type NextFunction } from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subcategoryRoutes.js"
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());

// app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subCategoryRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught by middleware:", err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, {}, err.message));
  }

  return res.status(500).json(new ApiError(500, "internal server error", err));
});

export default app;
