// const router = require("express").Router();
// const MedicineController = require("../controllers/Products/ProductController");
// const upload = require("../middleware/upload");

// router.post("/manual", upload.single("image"), (req, res) =>
//   MedicineController.createManual(req, res)
// );

// router.post("/csv", upload.single("file"), (req, res) =>
//   MedicineController.uploadCSV(req, res)
// );

// router.get("/filter", (req, res) => MedicineController.filterMedicines(req, res));
// router.get("/filter-type", (req, res) => MedicineController.filterByType(req, res));
// router.get("/all", (req, res) => MedicineController.getAll(req, res));
// router.get('/med/:id',(req, res) => MedicineController.getProductById(req, res))

// router.get('/date',(req, res) => MedicineController.filterByCreatedAtDate(req, res))
// router.delete('/del/:id',(req, res) => MedicineController.deleteById(req, res))
// router.get('/exp',(req, res) => MedicineController.ExpMedicines(req, res))
// router.get('/total',(req, res) => MedicineController.MedicineCount(req, res))


// router.put("/edit/:id",(req,res)=>MedicineController.editForm(req,res))

// module.exports = router;


import express from "express";
import multer from "multer";
import {
  createManual,
  uploadCSV,
  deleteMedicineById,
  updateMedicine,
  getMedicineCount,
  getExpiringMedicines,
  getProductById,
  getAllMedicines,
} from "../controllers/Products/ProductController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post("/manual", upload.single("image"), createManual);
router.post("/csv", upload.single("file"), uploadCSV);

router.get("/all", getAllMedicines);

router.get("/med/:id", getProductById);

router.get("/total", getMedicineCount);

router.get("/exp", getExpiringMedicines);

router.put("/edit/:id", updateMedicine);
router.delete("/del/:id", deleteMedicineById);

export default router;





