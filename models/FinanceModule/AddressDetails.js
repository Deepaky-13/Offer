import mongoose from "mongoose";

const addressFieldSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    poaType: { type: String, required: true, trim: true },
    poaNo: { type: String, required: true, trim: true },
    poaExpiry: { type: String, required: true, trim: true },
    changeAddress: { type: String, trim: true },
    residenceType: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true },
    bflBranch: { type: String, trim: true },
    customerAddress: { type: String, trim: true, required: true },
    addressLine1: { type: String, trim: true },
    addressLine2: { type: String, trim: true },
    addressLine3: { type: String, trim: true },
    area: { type: String, trim: true, required: true },
    landmark: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AddressDetails", addressFieldSchema);
