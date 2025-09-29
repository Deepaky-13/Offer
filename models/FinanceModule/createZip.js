import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const createZipSchema = new mongoose.Schema(
  {
    customerId: {
       type: String,
       default: uuidv4,
       unique: true,
    },
    zip: { type: String, trim: true, required: true },
    bflBranch: { type: String, trim: true },
    poaAddress: { type: String, trim: true, required: true },
  },
  { timestamps: true } // ✅ valid here
);

export default mongoose.model("createZip", createZipSchema);
