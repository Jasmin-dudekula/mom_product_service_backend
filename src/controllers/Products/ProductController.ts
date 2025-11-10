
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ProductMedicine from "../../models/Product.js"
import CategoryMedicine from "../../models/Category.model.js";
import SubcategoryMedicine from "../../models/subcategory.model.js";
import type { IProductMedicine } from "../../types/product.type.js";
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

  const filePath = req.file.path;

  try {
    //Pre-loading categories and subcategories
    const categoriesCache = new Map<string, any>();
    const subCategoriesCache = new Map<string, any>();

    const medicines: Partial<IProductMedicine>[] = [];
    const stream = fs.createReadStream(filePath).pipe(csvParser());

    for await (const row of stream) {
      const categoryName = row.category?.trim();
      const subCategoryName = row.subCategory?.trim();
      if (!categoryName || !subCategoryName) {
        console.warn(`Skipping row due to missing category/subcategory: ${row.productId}`);
        continue;
      }
      //Checking cache first,then database
      let category = categoriesCache.get(categoryName);
      if (!category) {
        category = await CategoryMedicine.findOne({ name: categoryName });
        if (!category) {
          category = await CategoryMedicine.create({ name: categoryName });
        }
        categoriesCache.set(categoryName, category);
      }

      const subCategoryKey = `${subCategoryName}_${category._id}`;
      let subCategory = subCategoriesCache.get(subCategoryKey);
      if (!subCategory) {
        subCategory = await SubcategoryMedicine.findOne({
          name: subCategoryName,
          category: category._id as Types.ObjectId,
        });
        if (!subCategory) {
          subCategory = await SubcategoryMedicine.create({
            name: subCategoryName,
            category: category._id as Types.ObjectId,
          });
        }
        subCategoriesCache.set(subCategoryKey, subCategory);
      }
      
      medicines.push({
        // productId: row.productId,
        name: row.name,
        type: row.type, 
        brandName: row.brandName,
        batchNumber: row.batchNumber,
        supplierName: row.supplierName,
        category: category._id as Types.ObjectId,
        subCategory: subCategory._id as Types.ObjectId,
        storageInstructions: row.storageInstructions,
        quantityPerUnit: row.quantityPerUnit,
        gst: row.gst || undefined,
        hsnCode: row.hsnCode || undefined,
        discount: row.discount || undefined,
        updatedOn: parseDate(row.updatedOn),
        manufactureDate: parseDate(row.manufactureDate),
        sellingPrice: Number(row.sellingPrice || 0),
        imageUrl:row.imageUrl || undefined,
        // details: row.details ? JSON.parse(row.details) : {}, 
        scientificName: row.scientificName || undefined,
        strength: row.strength || undefined,
        dosage: row.dosage, 
        dosageTiming: row.dosageTiming, 
        idealDosage:row.idealDosage,       
        genderUse: row.genderUse, 
        controlSubstance: row.controlSubstance,
        prescriptionNeeded: row.prescriptionNeeded, 
        coldChainFlag: row.coldChainFlag,
        
      });
    }

    const saved = await ProductMedicine.insertMany(medicines);

    // Parallel QR generation with error handling
    const qrPromises = saved.map(async (med) => {
      try {
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
        return { success: true, id: med._id };
      } catch (error) {
        console.error(`Failed to generate QR for medicine ${med._id}:`, error);
        return { success: false, id: med._id };
      }
    });

    const qrResults = await Promise.all(qrPromises);
    const failedCount = qrResults.filter(r => !r.success).length;

    // File cleanup (success case)
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });

    const message = failedCount > 0 
      ? `Medicines uploaded successfully. ${failedCount} QR code(s) failed to generate.`
      : "Medicines uploaded successfully";

    res.status(201).json(new ApiResponse(201, saved, message));

  } catch (error) {
    // File cleanup (error case)
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });
    throw error;
  }
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

// export const getExpiringMedicines = asyncHandler(async (_, res) => {
//   const today = new Date();
//   const expDate = new Date();
//   expDate.setDate(today.getDate() + 10);
//   const expiring = await ProductMedicine.find({ expiry: { $lte:expDate} });
//   res.status(200).json(new ApiResponse(200, expiring, "Expiring medicines fetched"));
// });


export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const med = await ProductMedicine.findById(id).populate("category subCategory");
  if (!med) throw new ApiError(404, "Medicine not found");

  res.status(200).json(new ApiResponse(200, med, "Medicine fetched"));
});

export const getAll= asyncHandler(async (req, res) => {
  const { search, category, subCategory, type, } = req.query;

  const query: Record<string, any> = {};
  if (search) {
    const regex = new RegExp(search as string, "i");
    query.$or = [
      { name: regex },
      { brandName: regex },
      { batchNumber: regex },
      { scientificName: regex }
    ];
  }
  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (type) query.type = type;
  // if (stockStatus) query.stockStatus = stockStatus;

  const meds = await ProductMedicine.find(query).populate("category subCategory");
  res.status(200).json(new ApiResponse(200, meds, "Medicines fetched successfully"));
});

export const filterByType = asyncHandler(async (req, res) => {
  const { type } = req.query;
  console.log(type)
  const meds = await ProductMedicine.find({ type }).populate("category subCategory");
  res.status(200).json(new ApiResponse(200, meds, `${type} products fetched successfully`));
});


export const filterByCreatedAtDate = asyncHandler(async (req, res) => {
  const { createdAt } = req.query;
  if (!createdAt) throw new ApiError(400, "createdAt date required");

  const start = new Date(createdAt as string);
  const end = new Date(createdAt as string);
  end.setHours(23, 59, 59, 999);

  const meds = await ProductMedicine.find({
    createdAt: { $gte: start, $lte: end },
  }).populate("category subCategory");

  res.status(200).json(new ApiResponse(200, meds, "Medicines filtered by createdAt date"));
});

export const filterMedicines = asyncHandler(async (req, res) => {
  const {
    category,
    subCategory,
    brandName,
    supplierName,
    strength,
    dosageTiming,
    prescription,
    dosage,
    genderUse,
    controlSubstance,
    coldChainFlag,
    page = 1,
    limit = 50
  } = req.query;

  const filter: Record<string, any> = {};

  // Parallel category lookups for better performance
  const categoryPromises = [];

  if (category) {
    categoryPromises.push(
      CategoryMedicine.findOne({ name: (category as string).trim() }).lean()
    );
  } else {
    categoryPromises.push(Promise.resolve(null));
  }

  if (subCategory) {
    categoryPromises.push(
      SubcategoryMedicine.findOne({ name: (subCategory as string).trim() }).lean()
    );
  } else {
    categoryPromises.push(Promise.resolve(null));
  }

  const [cat, subCat] = await Promise.all(categoryPromises);

  if (category && cat) filter.category = cat._id;
  if (subCategory && subCat) filter.subCategory = subCat._id;


  if (brandName) filter.brandName = new RegExp(brandName as string, "i");
  if (supplierName) filter.supplierName = new RegExp(supplierName as string, "i");
  if (strength) filter.strength = new RegExp(strength as string, "i");
  if (prescription) filter.prescriptionNeeded = prescription === "true" ? "Yes" : "No";
  if (dosageTiming) filter.dosageTiming = dosageTiming; 
  if (dosage) filter.dosage = dosage; 
  if (genderUse) filter.genderUse = genderUse; 
  if (controlSubstance) filter.controlSubstance = controlSubstance; 
  if (coldChainFlag) filter.coldChainFlag = coldChainFlag; 

  // Pagination to avoid all bulk result loading at once
  const pageNum = parseInt(page as string);
  const limitNum = Math.min(parseInt(limit as string), 100);
  const skip = (pageNum - 1) * limitNum;

  const [medicines, total] = await Promise.all([
    ProductMedicine.find(filter)
      .populate("category subCategory")
      .skip(skip)
      .limit(limitNum)
      .lean(),
    ProductMedicine.countDocuments(filter)
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      medicines,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    }, "Filtered medicines fetched successfully")
  );
});

  export const deleteAllMedicines = asyncHandler(async (req, res) => {
  const result = await ProductMedicine.deleteMany({});
  res
    .status(200)
    .json(new ApiResponse(200, result, "All medicines deleted successfully"));
});


