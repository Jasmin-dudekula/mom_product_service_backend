const express=require('express')
const router=express.Router()
const subcategoryController=require('../controllers/subcatogeryController')

router.post('/createsubcategory',subcategoryController.createSubcategory.bind(subcategoryController))
router.get('/createsubcategory',subcategoryController.getAllsubcategory.bind(subcategoryController))


module.exports=router