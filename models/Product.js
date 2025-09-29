import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    itemName: { type: String, required: true, trim: true },
    units: {
      type: String,
      enum: ["NOS", "KG", "Litre", "Box"],
      default: "NOS",
    },
    srNo: { type: String, trim: true, required: true },
    mdNo: { type: String, trim: true, required: true },
    srNoBarcodeUrl: { type: String, trim: true },
    mdNoBarcodeUrl: { type: String, trim: true },
    hsnCode: { type: String, trim: true },
    capacity: { type: String, trim: true },
    brand: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Electronics", "Furniture", "Apparel", "Other"],
      default: "Other",
    },
    price: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    itemGroup: { type: String, trim: true },
  },
  { timestamps: true }
);

// indexes
// productSchema.index({ sku: 1 });
// productSchema.index({ itemName: 1 });

export default mongoose.model("Product", productSchema);
