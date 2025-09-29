import mongoose from "mongoose";

const CreateCustomerSchema = new mongoose.Schema(
  {
    customerType: { type: String, required: true, trim: true },
    mobileNo: { type: String, required: true, trim: true, unique: true },
    cardNo: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("NewCustomer", CreateCustomerSchema);
