// const express=require('express')
// const router=express.Router()
// const subcategoryController=require('../controllers/subcatogeryController')

// router.post('/createsubcategory',subcategoryController.createSubcategory.bind(subcategoryController))
// router.get('/createsubcategory',subcategoryController.getAllsubcategory.bind(subcategoryController))



// module.exports=router

import express from "express"
import { SubCategoryController } from "../controllers/subcategeryController.js"

const router=express.Router()
const subcategoryController=new SubCategoryController()
router.get("/allsubcategory",(req,res,next)=>{
    subcategoryController.getAllsubcategory(req,res,next)
})
router.post("/createsubcategory",(req,res,next)=>{
    subcategoryController.createSubcategory(req,res,next)
})
export default router;