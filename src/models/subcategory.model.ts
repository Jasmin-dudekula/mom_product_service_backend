// const mongoose = require("mongoose");
import mongoose,{Schema} from "mongoose";
import type { ISubCategory } from "../types/subCategory.type.js";

const subcategorySchema = new Schema<ISubCategory>(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    
    name: {
      type: String,
      required: true,
    },

    img: {
      type: String,
    //   required: true,
    },
  },
  { timestamps: true }
);

subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

const SubcategoryMedicine=mongoose.model<ISubCategory>("SubcategoryMedicine", subcategorySchema);

export default SubcategoryMedicine
