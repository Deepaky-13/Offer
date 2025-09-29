import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String },
    bins: [
      {
        name: { type: String, required: true },
        capacity: { type: Number, default: 0 },
        priority: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Warehouse", warehouseSchema);
