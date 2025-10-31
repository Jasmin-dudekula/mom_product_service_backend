import mongoose,{Schema,Document} from "mongoose";
import type { Types } from "mongoose";
export interface ISubCategory extends Document{
    category:Types.ObjectId,
    name:string,
    img?:string,
    createdAt:Date,
    updatedAt:Date
}