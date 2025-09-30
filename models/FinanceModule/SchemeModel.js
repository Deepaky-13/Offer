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
    downPayment: { type: Number, default: 0 }, // Fixed amount
    roi: { type: Number, default: 0 }, // Annual rate %
    processingFee: { type: Number, default: 0 }, // Fixed amount
    dbd: { type: Number, default: 0 }, // Fixed amount
    invoiceExpiryDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Scheme", schemeSchema);
