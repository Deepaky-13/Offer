// models/Scheme.js
import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    schemeId: { type: String, required: true, unique: true },
    schemeName: { type: String, required: true },
    grossAdvTenor: { type: String, required: true }, // e.g. "12/4"
    schemeCategory: {
      type: String,
      enum: ["Manufacturer Tie Up", "Non-Tie Up Scheme", "General"],
      default: "General",
    },
    downPayment: { type: Number, default: 0 },
    roi: { type: Number, default: 0 }, // Annual rate %
    processingFeePercent: { type: Number, default: 0 }, // %
    dbdPercent: { type: Number, default: 0 }, // %
    invoiceExpiryDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Scheme", schemeSchema);