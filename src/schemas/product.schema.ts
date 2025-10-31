import { z } from "zod";

export const medicineSchema = z.object({
  productId: z.string(),
  name: z.string(),
  type: z.enum(["medicine", "nonmedicine"]),
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
  expiry: z.coerce.date().optional(),
  manufactureDate: z.coerce.date().optional(),
  sellingPrice: z.number().optional(),
  lastSoldDate: z.coerce.date().optional(),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"])
    .default("in_stock"),
  imageUrl: z.string(),
  details: z.record(z.string(), z.any()).default({}),
  qrCodeUrl: z.string(),
});


export type ProductZodSchema = z.infer<typeof medicineSchema>;

