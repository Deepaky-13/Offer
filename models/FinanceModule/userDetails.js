import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    income: { type: String, required: true, trim: true },
    poiDetails: { type: String, required: true, trim: true },
    poiNumber: { type: String, required: true, trim: true, unique: true },
    expiry: { type: String, required: true, trim: true },
    fName: { type: String, required: true, trim: true },
    mName: { type: String, trim: true },
    lName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    dob: { type: String, required: true, trim: true },
    employeeType: { type: String, required: true, trim: true },
    panAvailable: { type: String, required: true, trim: true },
    panNo: { type: String, trim: true },
    nameOnPan: { type: String, trim: true },
    alterNameOnPan: { type: String, trim: true },
    zip: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("UserDetails", userDetailsSchema);
