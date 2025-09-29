import mongoose from "mongoose";

const additionalInformationSchema = mongoose.Schema(
  {
    customerId: { type: String, required: true, index: true },
    fatherName: { type: String, trim: true, required: true },
    motherName: { type: String, trim: true, required: true },
    altNo: { type: String, trim: true, required: true, unique: true },
    language: { type: String, trim: true },
    communicateLang: { type: String, trim: true, required: true },
    maritalStatus: { type: String, trim: true, required: true },
    qualification: { type: String, trim: true, required: true },
    mailingAddress: { type: String, trim: true, required: true },
  },
  { timeStamps: true }
);

export default mongoose.model("AdditionalInfo", additionalInformationSchema);
