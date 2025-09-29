import mongoose from "mongoose";

const stockInwardSchema = new mongoose.Schema(
  {
    billNo: { type: String, required: true },
    vendorName: { type: String, required: true },
    vendorLocation: { type: String },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    SrNo: { type: String, required: true },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    bin: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true, min: 1 },
    taxPercent: { type: Number, default: 0 },
    taxableAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    createdBy: { type: String }, // userId or username
    inwardDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("StockInward", stockInwardSchema);
