import mongoose from "mongoose";

const stockOutwardSchema = new mongoose.Schema(
  {
    postingNo: { type: String, required: true, unique: true }, 
    salesType: {
      type: String,
      enum: ["Sales", "Transfer", "Scrap"],
      required: true,
    },
    salesBillNo: { type: String },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    SrNo: { type: String },
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
    createdBy: { type: String },
    outwardDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("StockOutward", stockOutwardSchema);
