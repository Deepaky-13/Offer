import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    bin: { type: mongoose.Schema.Types.ObjectId, required: true }, // bin name inside warehouse
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
