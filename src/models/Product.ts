import mongoose, { Schema } from "mongoose";
import type { IProductMedicine} from "../types/product.type.ts";

const MedicineSchema = new mongoose.Schema<IProductMedicine>(
  {
    productId: 
    { type: String, 
      required: true 
    },
    name: 
    { type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["medicine", "nonmedicine"],
      required: true 
    },
    brandName: { 
      type: String, 
      required: true
     },
    batchNumber: {
      type: String,
      required: true
    },
    supplierName: { 
    type: String, 
    required: true 
    },
    category: { 
    type: Schema.Types.ObjectId, 
    ref: "CategoryMedicine", 
    required: true 
   },
    subCategory: { 
    type: Schema.Types.ObjectId, 
    ref: "SubcategoryMedicine", 
    required: true 
    },
    storageInstructions: { 
    type: String 
    },
    quantityPerUnit: { 
    type: String, 
    required: true },

    gst: { 
      type: String 
    },
    hsnCode: { 
      type: String
     },
    discount: { 
      type: String 
    },
    updatedOn: { 
      type: Date, 
      // default: Date.now 
    },
    manufactureDate: { 
      type: Date 
    },
    sellingPrice: {
      type: Number 
      },
    imageUrl:{
      type:String
    },
    details: {
       type: Object, 
       default: {} 
     },
     qrCodeUrl:{
      type:String
     },
     scientificName:{
      type:String
     },
     strength:{
      type:String
     },
     dosage:{
      type:String,
      enum:['BeforeFood','AfterFood']
     },
     dosageTiming:{
      type:String,
      enum:['Morning','After','Night']
     },
     genderUse:{
      type:String,
      enum:['Male','Female','Child']
     },
     controlSubstance:{
      type:String,
      enum:['Yes','No']
     },
     prescriptionNeeded:{
      type:String,
      enum:['Yes','No']
     },
     coldChainFlag:{
      type:String,
      enum:['Yes','No']
     }
  },
  { timestamps: true }
);

const ProductMedicine = mongoose.model<IProductMedicine>("ProductMedicine", MedicineSchema);
export default ProductMedicine;