// const BaseController=require('../controllers/BaseController');



import { asyncHandler } from "../utils/asyncHandler.js";
import { subcategory } from "../schemas/subcategory.schema.js";
import SubcategoryMedicine from "../models/subcategory.model.js";
import ApiResponse from "../utils/ApiResponse.js";



import type { Request, Response, NextFunction } from "express";
export class SubCategoryController{
    createSubcategory=asyncHandler(
        async (req:Request,res:Response,next:NextFunction) => {
            try {
                const parseData=subcategory.parse(req.body);
                const imageUrl = req.file ? (req.file as any).location : null;
                const newSubCategory = new SubcategoryMedicine({
                    name: parseData.name,
                    category: parseData.category,
                    img: imageUrl,
                });

                await newSubCategory.save()
                res.status(201).json(new ApiResponse(201,newSubCategory,"SubCategory Added Successfully"))
            } catch (error) {
                console.error("Error creating subcategory:", error);
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    errors: error,
                });
            }
        }
    )
    getAllsubcategory=asyncHandler(
        async (req:Request,res:Response,next:NextFunction) => {
            const allSubCategory=await SubcategoryMedicine.find({})
            res.status(200).json(new ApiResponse(200,allSubCategory,"All subCategory"))
        }
    )
}