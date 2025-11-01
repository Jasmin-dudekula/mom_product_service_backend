import multer from "multer";
import type { StorageEngine } from "multer"; 
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";
import s3 from "../config/s3.js";

dotenv.config();

const storage: StorageEngine = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME as string,
  acl: "public-read",
  metadata: (req, file, cb) => {
    console.log(file);
    cb(null, { fieldName: file.originalname });
  },
  key: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${path.basename(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
