import Stock from "../models/Stock.js";
import StockOutward from "../models/StockOutward.js";

const generatePostingNo = () =>
  "POST-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

// Create Stock Outward
export const createStockOutward = async (req, res) => {
  try {
    const {
      salesType,
      salesBillNo,
      product,
      SrNo,
      warehouse,
      bin,
      quantity,
      taxPercent,
      taxableAmount,
      finalAmount,
      createdBy,
    } = req.body;

    // ✅ Check stock availability
    let stock = await Stock.findOne({ product, warehouse, bin });
    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({ msg: "Insufficient stock" });
    }

    // ✅ Unique Posting No
    const postingNo = generatePostingNo();

    // 1. Save transaction log
    const outward = await StockOutward.create({
      postingNo,
      salesType,
      salesBillNo,
      product,
      SrNo: SrNo || "LOT-" + Date.now(),
      warehouse,
      bin,
      quantity,
      taxPercent,
      taxableAmount,
      finalAmount,
      createdBy,
    });

    // 2. Update stock balance
    stock.quantity -= quantity;
    await stock.save();

    res.status(201).json({ msg: "Stock outward recorded", outward, stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOutwardReport = async (req, res) => {
  try {
    const records = await StockOutward.find()
      .populate("product", "sku itemName capacity category")
      .populate("warehouse", "name bins")
      .lean();

    const formatted = records.map((r) => {
      const binData = r.warehouse?.bins?.find(
        (b) => b._id.toString() === r.bin?.toString()
      );
      return {
        ...r,
        bin: binData ? { _id: binData._id, name: binData.name } : null,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};
