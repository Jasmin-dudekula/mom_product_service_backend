import CategoryMedicine from "../models/Category.model.js";
import { category } from "../schemas/category.schema.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";


export class CategoryController {
  createCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
   
      const parseData = category.parse(req.body);

      
      const newCategory = new CategoryMedicine(parseData);
      await newCategory.save();

   
      res
        .status(201)
        .json(new ApiResponse(201, newCategory, "Category created successfully"));
    }
  );

  getAllCategories = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const categories = await CategoryMedicine.find();

      res
        .status(200)
        .json(new ApiResponse(200, categories, "All categories fetched successfully"));
    }
  );
}