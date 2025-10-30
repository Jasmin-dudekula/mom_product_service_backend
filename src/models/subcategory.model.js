const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    img: {
      type: String,
    //   required: true,
    },
  },
  { timestamps: true }
);

subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("SubcategoryMedicine", subcategorySchema);
