
import { Document, Types } from "mongoose";
import type { ProductZodSchema } from "../schemas/product.schema.js";

export interface IProductMedicine extends Omit<ProductZodSchema, "category" | "subCategory">, Document {
  _id: Types.ObjectId;
  category: Types.ObjectId;
  subCategory: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}





