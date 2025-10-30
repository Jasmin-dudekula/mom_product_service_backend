const BaseController=require('../controllers/BaseController');

const subCategory=require('../models/subcategory.model')

class subcategories extends BaseController{

    async createSubcategory( req , res){
        try {
            const subcategori=new subCategory(req.body)

            const save=await subcategori.save();
            return this.success(res, save, "subCategory created succefull");
            
        } catch (error) {
                     return this.error(res, 400, "failed to create SubCategory", error.message);    

        }
    }

    async getAllsubcategory( req , res){
        try {

            const allSubCategory=await subCategory.find({})
            return this.success(res, allSubCategory, "All subCategory");            
            
        } catch (error) {
             return this.error(res, 400, "failed to get All SubCategory", error.message);    

        }
    }
}

module.exports=new subcategories()