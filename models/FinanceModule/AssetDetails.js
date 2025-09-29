// models/AssetDetails.js
import mongoose from "mongoose";

const assetDetailsSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    product: { type: String, required: true },
    invoiceAmount: { type: Number, required: true },
    loanAmount: { type: Number, required: true },
    combo: { type: Number, default: 0 }, // user down payment
    paymentDay: { type: Number, default: 1 }, // user selected day of month
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
    },
    emi: { type: Number },
    processingFee: { type: Number },
    dbd: { type: Number },
    downPayment: { type: Number },
    emiDates: [{ type: Date }], // store EMI dates for schedule
    paidEMIs: {
      type: [Boolean],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("AssetDetails", assetDetailsSchema);
