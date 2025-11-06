
import express from "express";
import multer from "multer";
import {
  createManual,
  uploadCSV,
  deleteMedicineById,
  updateMedicine,
  getMedicineCount,
  getProductById,
  getAll,
  filterByType,
  filterMedicines,
  filterByCreatedAtDate,
} from "../controllers/Products/ProductController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post("/manual", upload.single("image"), createManual);
router.post("/csv", upload.single("file"), uploadCSV);

router.get("/all", getAll);

router.get("/med/:id", getProductById);

router.get("/total", getMedicineCount);

// router.get("/exp", getExpiringMedicines);
router.put("/edit/:id", updateMedicine);
router.delete("/del/:id", deleteMedicineById);
router.get("/filter-type", filterByType);
router.get("/date", filterByCreatedAtDate);
router.get("/filter", filterMedicines);

export default router;





