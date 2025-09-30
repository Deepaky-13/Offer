// models/AssetDetails.js
import mongoose from "mongoose";

const emiSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true }, // EMI amount for the month
    paid: { type: Boolean, default: false }, // Whether this EMI is paid
    paymentDate: { type: Date }, // When the EMI was paid
    paymentMode: { type: String, default: "Cash" }, // Payment mode: Cash, Online, Card, etc.
    lateFine: { type: Number, default: 0 }, // Track if paid late
  },
  { _id: false }
);

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
    paidEMIs: [emiSchema], // track each month EMI status, mode, late payment
    generalLatePayment: { type: Boolean, default: false }, // still keep general late payment if needed
  },
  { timestamps: true }
);

export default mongoose.model("AssetDetails", assetDetailsSchema);
