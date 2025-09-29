// models/StockExchange.js
import mongoose from "mongoose";

const stockExchangeSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    fromBin: { type: mongoose.Schema.Types.ObjectId, required: true },
    toBin: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    taxableAmount: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    transferNo: { type: String, unique: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "completed",
    }, // default completed for admin immediate transfers
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestedAt: { type: Date },
    approvedAt: { type: Date },
    rejectReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("StockExchange", stockExchangeSchema);
