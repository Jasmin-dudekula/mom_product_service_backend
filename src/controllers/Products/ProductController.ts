
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ProductMedicine from "../../models/Product.js"
import CategoryMedicine from "../../models/Category.model.js";
import SubcategoryMedicine from "../../models/subcategory.model.js";
import type { IProductMedicine } from "../../types/product.type.js"
import fs from "fs";
import csvParser from "csv-parser";
import QRCode from "qrcode";
import AWS from "aws-sdk";
import type { Types } from "mongoose";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  throw new Error("Missing AWS environment variables");
}

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const parseDate = (value?: string): Date | undefined => {
  if (!value || value.toLowerCase() === "n/a") return undefined;
  const parts = value.split("-");
  if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  return undefined;
};


export const createManual = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as IProductMedicine;
  const file = (req as any).file;
  if (file && file.path) body.imageUrl = file.path;

  const medicine = new ProductMedicine(body);

  const qrBuffer = await QRCode.toBuffer(medicine._id.toString(), { type: "png" });
  const uploadResult = await s3
    .upload({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `qrcodes/medicine-${medicine._id}.png`,
      Body: qrBuffer,
      ContentType: "image/png",
      ACL: "public-read",
    })
    .promise();

  medicine.qrCodeUrl = uploadResult.Location;
  const saved = await medicine.save();

  res.status(201).json(new ApiResponse(201, saved, "Medicine created successfully"));
});


export const uploadCSV = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, "CSV file is required");

  const medicines: Partial<IProductMedicine>[] = [];
  const stream = fs.createReadStream(req.file.path).pipe(csvParser());

  for await (const row of stream) {
    const categoryName = row.category?.trim();
    const subCategoryName = row.subCategory?.trim();

    let category = await CategoryMedicine.findOne({ name: categoryName });
    if (!category) category = await CategoryMedicine.create({ name: categoryName });

    let subCategory = await SubcategoryMedicine.findOne({
      name: subCategoryName,
      category: category._id as Types.ObjectId,
    });
    if (!subCategory)
      subCategory = await SubcategoryMedicine.create({
        name: subCategoryName,
        category: category._id as Types.ObjectId,
      });

    medicines.push({
      productId: row.productId,
      name: row.name,
      type: row.type,
      brandName: row.brandName,
      batchNumber: row.batchNumber,
      supplierName: row.supplierName,
      category: category._id as Types.ObjectId,
      subCategory: subCategory._id as Types.ObjectId,
      quantityPerUnit: row.quantityPerUnit,
      storageInstructions: row.storageInstructions,
      gst: row.gst,
      hsnCode: row.hsnCode,
      discount: row.discount,
      updatedOn: parseDate(row.updatedOn),
      expiry: parseDate(row.expiry),
      manufactureDate: parseDate(row.manufactureDate),
      sellingPrice: Number(row.sellingPrice || 0),
      stockStatus: row.stockStatus || "in_stock",
    });
  }

  const saved = await ProductMedicine.insertMany(medicines);

  for (const med of saved) {
    const qrBuffer = await QRCode.toBuffer(med._id.toString(), { type: "png" });
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `qrcodes/medicine-${med._id}.png`,
        Body: qrBuffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();
    med.qrCodeUrl = uploadResult.Location;
    await med.save();
  }

  res.status(201).json(new ApiResponse(201, saved, "Medicines uploaded successfully"));
});


export const deleteMedicineById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Medicine ID is required");

  const deleted = await ProductMedicine.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Medicine not found");

  res.status(200).json(new ApiResponse(200, deleted, "Deleted successfully"));
});

export const updateMedicine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await ProductMedicine.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(new ApiResponse(200, updated, "Updated successfully"));
});

export const getMedicineCount = asyncHandler(async (_, res) => {
  const total = await ProductMedicine.countDocuments();
  res.status(200).json(new ApiResponse(200, total, "Total count fetched"));
});

export const getExpiringMedicines = asyncHandler(async (_, res) => {
  const today = new Date();
  const expDate = new Date();
  expDate.setDate(today.getDate() + 10);

  const expiring = await ProductMedicine.find({ expiry: { $lte: expDate } });
  res.status(200).json(new ApiResponse(200, expiring, "Expiring medicines fetched"));
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const med = await ProductMedicine.findById(id).populate("category subCategory");
  if (!med) throw new ApiError(404, "Medicine not found");

  res.status(200).json(new ApiResponse(200, med, "Medicine fetched"));
});

export const getAllMedicines = asyncHandler(async (req, res) => {
  const { search, category, subCategory, type, stockStatus } = req.query;

  const query: Record<string, any> = {};
  if (search) {
    const regex = new RegExp(search as string, "i");
    query.$or = [
      { name: regex },
      { brandName: regex },
      { batchNumber: regex },
      { "details.scientificName": regex },
    ];
  }
  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (type) query.type = type;
  if (stockStatus) query.stockStatus = stockStatus;

  const meds = await ProductMedicine.find(query).populate("category subCategory");
  res.status(200).json(new ApiResponse(200, meds, "Medicines fetched successfully"));
});


