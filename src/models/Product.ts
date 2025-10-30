const mongoose = require("mongoose");
// const { Schema } = mongoose;

const MedicineSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true
    },
    type:{
        type:String,
        enum:['medicine','nonmedicine'],
        required:true

    },
    brandName: {
        type: String,
        required: true,

    },
    batchNumber: {
        type: String,
        required: true,

    },
    supplierName: {
        type: String,
        required: true,

    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryMedicine',
        required: true

    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubcategoryMedicine',
        required: true

    },
    storageInstructions: {
        type: String,

    },
    quantityPerUnit: {
        type: String,
        required: true,
        
    },
    gst: {
        type: String,

    },
    hsnCode: {
        type: String,

    },
    discount: {
        type: String,

    },
    updatedOn: {
        type: Date,
        default: Date.now,
    },
    expiry: {
        type: Date,
        
    },
    manufactureDate: {
        type: Date,
       
    },
    sellingPrice: {
        type: Number,
       
    },
    lastSoldDate: {
        type: Date,
    },
    stockStatus: {
        type: String,
        enum: ["in_stock", "low_stock", "out_of_stock"],
        default: "in_stock",
    },
    imageUrl: {
        type: String,
    },
    details: {
        type: Object,
        default: {}
    },
    warehouseId: {
        // type: Schema.Types.ObjectId,
        // ref: 'Warehouse',
        // required: true
    },
     qrCodeUrl: {
    type: String,
  }

},{timestamps:true});

module.exports = mongoose.model("Productmedicines", MedicineSchema);
