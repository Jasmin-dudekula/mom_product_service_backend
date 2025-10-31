// const BaseController = require("../BaseController");
// const Medicine = require("../../models/Product");
// const fs = require("fs");
// const csvParser = require("csv-parser");
// const mongoose = require("mongoose");
// const Category = require('../../models/Category.model')
// const SubCategory = require('../../models/subcategory.model')
// const AWS = require("aws-sdk");
// const QRCode = require("qrcode");
// const s3 = new AWS.S3();

// class MedicineController extends BaseController {

//   async createManual(req, res) {
//     try {
//       const body = req.body;
//       if (req.file) body.imageUrl = req.file.path;
//       const medicine = new Medicine(body);

//       const qrBuffer = await QRCode.toBuffer(medicine._id.toString(), { type: "png" });
//       const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `qrcodes/medicine-${medicine._id}.png`,
//         Body: qrBuffer,
//         ContentType: "image/png",
//         ACL: "public-read",
//       };

//       const uploadResult = await s3.upload(params).promise();

//       medicine.qrCodeUrl = uploadResult.Location;
        
//       const saved = await medicine.save();
//     return this.success(res, saved, "Medicine created");
//   } catch(err) {
//     return this.error(res, 500, "Failed to create medicine", err.message);
//   }
// }


//   async uploadCSV(req, res) {
//   try {
//     if (!req.file) return this.error(res, 400, "CSV file required");

//     const medicines = [];
//     const stream = fs.createReadStream(req.file.path).pipe(csvParser());

//     for await (const row of stream) {
//       try {
//         const categoryName = row.category?.trim();
//         const subCategoryName = row.subCategory?.trim();


//         let category = await Category.findOne({ name: categoryName });
//         if (!category) {
//           category = await Category.create({ name: categoryName });
//         }

//         let subCategory = await SubCategory.findOne({ name: subCategoryName, category: category._id });
//         if (!subCategory) {
//           subCategory = await SubCategory.create({ name: subCategoryName, category: category._id });
//         }

//         const parseDate = (value) => {
//           if (!value || value.toLowerCase() === 'n/a') return null;
//           const parts = value.split('-');
//           if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
//           return null;
//         };

//         const medicine = {
//           productId: row.productId,
//           name: row.name,
//           type: row.type,
//           brandName: row.brandName,
//           batchNumber: row.batchNumber,
//           supplierName: row.supplierName,
//           category: category._id,
//           subCategory: subCategory._id,
//           storageInstructions: row.storageInstructions,
//           quantityPerUnit: row.quantityPerUnit,
//           gst: row.gst,
//           hsnCode: row.hsnCode,
//           discount: row.discount,
//           updatedOn: parseDate(row.updatedOn),
//           expiry: parseDate(row.expiry),
//           manufactureDate: parseDate(row.manufactureDate),
//           sellingPrice: Number(row.sellingPrice || 0),
//           lastSoldDate: parseDate(row.lastSoldDate),
//           stockStatus: row.stockStatus,
//           details:
//             row.type === "medicine"
//               ? {
//                 scientificName: row.scientificName || "",
//                 form: row.form,
//                 strength: row.strength || "",
//                 idealDosage: row.idealDosage || "",
//                 route: row.route || "",
//                 dosageTiming: row.dosageTiming || "",
//                 dosageFrequency: row.dosageFrequency || "",
//                 durationOfUse: row.durationOfUse || "",
//                 sideEffects: row.sideEffects || "",
//                 allergyWarnings: row.allergyWarnings || "",
//                 controlledSubstance: row.controlledSubstance === "true",
//                 prescriptionRequired: row.prescriptionRequired === "true",
//                 usageInstructions: row.usageInstructions || ""
//               }
//               : {
//                 warranty: row.warranty || ""
//               }
//         };

//         medicines.push(medicine);
//       } catch (rowError) {
//         console.error(" Failed to process row:", rowError.message);
//       }
//     }

//     const saved = await Medicine.insertMany(medicines);
//     for (const med of saved) {
//       const qrBuffer = await QRCode.toBuffer(med._id.toString(), { type: "png" });
//       const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `qrcodes/medicine-${med._id}.png`,
//         Body: qrBuffer,
//         ContentType: "image/png",
//         ACL: "public-read",
//       };

//       const uploadResult = await s3.upload(params).promise();

//       med.qrCodeUrl = uploadResult.Location;
//       await med.save();
//     }

//     return this.success(res, saved, " Medicines uploaded successfully");
//   } catch (err) {
//     console.error("Upload CSV Error:", err.message);
//     return this.error(res, 500, "CSV upload failed", err.message);
//   }
// }

// async deleteById( req, res){
//   try {

//     const {id}=req.params;
//     if(!id)
//     {
//       console.log("id not found");
//       return this.error(res, 500, "id not found", err.message);
//     }

//     const delData= await Medicine.findByIdAndDelete(id);
//       return this.success(res,delData, " Medicines deleted successfully");
    
//   } catch (error) {
//       return this.error(res, saved, "failed to delete MedicinesById ");
    
//   }
// }

// async EditForm(req, res) {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return this.error(res, 400, "ID not found"); 
//     }
//     const updatedData = await Medicine.findByIdAndUpdate(
//       id,
//       req.body,
//       { new: true } 
//     );

//     return this.success(res, updatedData, "Form edited successfully");
//   } catch (error) {
//     return this.error(res, 500, "Failed to edit form", error.message);
//    } 
// }



// async MedicineCount( req , res){
//   try {
    

//     const totalProducts=await Medicine.countDocuments();
//           return this.success(res,totalProducts, "succes");


//   } catch (error) {
//               return this.error(res,500, "internal server error",error);

//   }
// }

// async ExpMedicines(req , res){
//   try {
//     const today=new Date()
//     const expDate=new Date()
//     expDate.setDate(today.getDate()+10)
//     console.log("today",today);
//     console.log("exp date",expDate);

//     const ExpMedicines=await Medicine.find({expiry:{"$eq":expDate}})

//     console.log("ExpMedicines",this.ExpMedicines);

//     return this.success(res,ExpMedicines, " ExpMedicines find successfully");


//   } catch (error) {
//     return this.error(res,error, " Failed to finnd ExpMedicines");
//   }
// }

// async getProductById(req,res){
//   try{
//     const {id} = req.params
//     const meds = await Medicine.findById(id).populate("category subCategory");
    
//     return this.success(res, meds, "Medicines fetched");

//   }catch(error){
//         return this.error(res, 500, "Failed to fetch medicines", error.message);
//   }
// }

//  async getAll(req, res) {
//   try {
//     const { search, category, subCategory, type, stockStatus } = req.query;


//     const query = {};

//     if (search) {
//       const regex = new RegExp(search, "i");
//       query.$or = [
//         { name: regex },
//         { brandName: regex },
//         { batchNumber: regex },
//         { "details.scientificName": regex }
//       ];

//     }

//     if (category) query.category = category;
//     if (subCategory) query.subCategory = subCategory;
//     if (type) query.type = type;
//     if (stockStatus) query.stockStatus = stockStatus;


//     const meds = await Medicine.find(query).populate("category subCategory");

//     return this.success(res, meds, "Medicines fetched");
//   } catch (err) {
//     return this.error(res, 500, "Failed to fetch medicines", err.message);
//   }
// }

// async filterByCreatedAtDate(req, res) {
//   try {
//     const { createdAt } = req.query;

//     const filter = {};

//     if (createdAt) {
//       const start = new Date(createdAt);
//       const end = new Date(createdAt);
//       end.setHours(23, 59, 59, 999);

//       filter.createdAt = {
//         $gte: start,
//         $lte: end
//       };
//     }

//     const med = await Medicine.find(filter).populate("category subCategory");

//     return this.success(res, med, "Medicines fetched by createdAt date");
//   } catch (error) {
//     return this.error(res, 500, "Failed to fetch medicines", error.message);
//   }
// }


// async filterByType(req, res) {
//     try {
//       const { type } = req.query;

//       if (!type || !["medicine", "nonmedicine"].includes(type)) {
//         return this.error(res, 400, "Invalid type. Use 'medicine' or 'nonmedicine'");
//       }

//       const medicines = await Medicine.find({ type }).populate("category subCategory");

//       return this.success(res, medicines, `${type} products fetched successfully`);
//     } catch (err) {
//       return this.error(res, 500, "Failed to filter by type", err.message);
//     }
//   }


//   async filterMedicines(req, res) {
//   try {
    
   
//       const {
//         category,
//         subCategory,
//         brandName, 
//         supplierName,
//         form,
//         strength,
//         intakeroute,
//         doseTime,
//         doseFrequency,
//         prescription
//       } = req.query;

//     const filter = {};

//     if (category) {
//       const categoryDoc = await Category.findOne({ name: category.trim() });
//       if (categoryDoc) {
//         filter.category = categoryDoc._id;
//       } else {
//         console.warn(`Category '${category}' not found`);
//         return this.success(res, [], `No medicines found: category '${category}' not found`);
//       }
//     }
//     if (subCategory) {
//       const subCategoryDoc = await SubCategory.findOne({ name: subCategory.trim() });
//       if (subCategoryDoc) {
//         filter.subCategory = subCategoryDoc._id;
//       } else {
//         console.warn(`SubCategory '${subCategory}' not found`);
//         return this.success(res, [], `No medicines found: subCategory '${subCategory}' not found`);
//       }
//     }

//     if (brandName) filter.brandName = new RegExp(brandName, "i");
//     if (supplierName) filter.supplierName = new RegExp(supplierName, "i");
//     if (prescription) filter.prescription = new RegExp(prescription, "i");

//     if (form) filter["details.form"] = new RegExp(form, "i");
//     if (strength) filter["details.strength"] = new RegExp(strength, "i");
//     if (intakeroute) filter["details.route"] = new RegExp(intakeroute, "i");
//     if (doseTime) filter["details.dosageTime"] = new RegExp(doseTime, "i");
//     if (doseFrequency) filter["details.dosageFrequency"] = new RegExp(doseFrequency, "i");


//     const medicines = await Medicine.find(filter).populate("category subCategory");

//     return this.success(res, medicines, "Filtered medicines fetched successfully");
//   } catch (err) {
//     return this.error(res, 500, "Failed to filter medicines", err.message);
//   }
// }
// }


// module.exports = new MedicineController();
