
import express from "express"
import { SubCategoryController } from "../controllers/subcategeryController.js"
import multer from "multer";
import {upload} from "../middlewares/s3.js";

const router=express.Router()
const subcategoryController=new SubCategoryController()
router.get("/createsubcategory",(req,res,next)=>{
    subcategoryController.getAllsubcategory(req,res,next)
})
router.post("/createsubcategory",upload.single('img'),(req,res,next)=>{
    subcategoryController.createSubcategory(req,res,next)
})
export default router;