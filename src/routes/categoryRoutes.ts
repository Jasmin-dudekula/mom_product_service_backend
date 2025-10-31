import express from "express";
import { CategoryController } from "../controllers/CategoryController.js";

const router = express.Router();
const categoryController = new CategoryController();


router.post("/createCategory", (req, res, next) =>
  categoryController.createCategory(req, res, next)
);


router.get("/all", (req, res, next) =>
  categoryController.getAllCategories(req, res, next)
);

export default router;