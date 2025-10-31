import mongoose, { Schema, Document } from "mongoose";


export interface ICategoryMedicine extends Document {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
