const express =require('express')

const router=express.Router()

const categoryController=require('../controllers/categoryController')


router.post("/createCategory",categoryController.createCategory.bind(categoryController))
router.get("/getAllcategory",categoryController.getAllCategory.bind(categoryController))


module.exports=router