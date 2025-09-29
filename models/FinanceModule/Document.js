import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    aadhar: { type: String },
    pan: { type: String },
    income: { type: String },
    asset: { type: String },
    passbook: {type: String},
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
