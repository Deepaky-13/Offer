import mongoose from "mongoose";

const OfficeSchema = mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    companyName: { type: String, trim: true, required: true },
    extraCompany: { type: String, trim: true },
    companyNature: { type: String, trim: true, required: true },
    otherNature: { type: String, trim: true },
    designation: { type: String, trim: true, required: true },
    income: { type: String, trim: true, required: true },
    officePhoneNoType: { type: String, trim: true, required: true },
    officePhoneNo: { type: String, trim: true, required: true },
    officePinCode: { type: String, trim: true, required: true },
    officeAddressLine1: { type: String, trim: true, required: true },
    officeAddressLine2: { type: String, trim: true },
    officeAddressLine3: { type: String, trim: true },
    officeArea: { type: String, trim: true, required: true },
    officeCity: { type: String, trim: true, required: true },
    officeState: { type: String, trim: true, required: true },
    loanNo : {type : String, trim: true},
    status : {type: String, trim: true}
  },
  { timeStamps: true }
);

export default mongoose.model("OfficeInfo", OfficeSchema);
