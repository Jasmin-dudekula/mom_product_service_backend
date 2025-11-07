import { z } from "zod";

export const medicineSchema = z.object({
  // productId: z.string(),
  name: z.string(),
  type: z.enum(["Medicine", "Non-Medicine"]),
  brandName: z.string(),
  batchNumber: z.string(),
  supplierName: z.string(),
  category: z.string(),
  subCategory:z.string(),
  storageInstructions: z.string(),
  quantityPerUnit: z.string(),
  gst: z.string().optional(),
  hsnCode: z.string().optional(),
  discount: z.string().optional(),
  updatedOn: z.coerce.date().optional(), 
  // expiry: z.coerce.date().optional(),
  manufactureDate: z.coerce.date().optional(),
  sellingPrice: z.number().optional(),
  // lastSoldDate: z.coerce.date().optional(),
  // stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"])
  //   .default("in_stock"),
  imageUrl: z.string(),
  qrCodeUrl: z.string(),
  scientificName: z.string().optional(),
  strength: z.string().optional(),
  dosage:z.enum(['Before Food','After Food']),
  dosageTiming:z.enum(['Morning','Afternoon','Night']),
  idealDosage:z.string(),
  genderUse:z.enum(['Male','Female','Child','All']),
  controlSubstance:z.enum(['Yes','No']),
  prescriptionNeeded:z.enum(['Yes','No']),
  coldChainFlag:z.enum(['Yes','No']),
});


export type ProductZodSchema = z.infer<typeof medicineSchema>;

