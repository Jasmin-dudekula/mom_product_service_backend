const category=require('../models/Category.model');

const BaseController=require('../controllers/BaseController')


class Categoryies extends BaseController{

    async createCategory(req , res){
        try {

        const Category= new category(req.body);
        const save=await Category.save();
        return this.success(res, save, "category created succefull");
            
        } catch (error) {

         return this.error(res, 400, "failed to create category", error.message);    

            
        }

    }

    async getAllCategory( req , res){

        try {

            const getAll=await category.find({})
            if(!getAll)
            {
                console.log("category data is notfound")
            }
                    return this.success(res, getAll,"all categorys");


            
        } catch (error) {
                     return this.error(res, 400, "failed to get all category", error.message);    

        }
    }
}

module.exports= new Categoryies()