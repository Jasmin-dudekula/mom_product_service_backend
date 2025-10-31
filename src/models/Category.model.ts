import mongoose, { Schema, Document } from "mongoose";
import type { ICategoryMedicine } from "../types/category.type.js";


const categorySchema = new Schema<ICategoryMedicine>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    }
  },
  { timestamps: true }
);

const CategoryMedicine = mongoose.model<ICategoryMedicine>("CategoryMedicine", categorySchema);
export default CategoryMedicine;