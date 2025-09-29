// controllers/stockExchangeController.js
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";
import StockExchange from "../models/StockExchange.js";
import Warehouse from "../models/Warehouse.js";

// Helper
const generateTransferNo = () =>
  "TXN-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

// Core transfer logic wrapped in a mongoose session (atomic)
const performTransfer = async (
  {
    product,
    fromWarehouse,
    toWarehouse,
    fromBin,
    toBin,
    quantity,
    taxableAmount = 0,
    taxPercent = 0,
    transferNo,
  },
  session
) => {
  // Validate product
  const existingProduct = await Product.findById(product).session(session);
  if (!existingProduct) throw { status: 404, msg: "Product not found" };

  // Validate warehouses
  const sourceWarehouse = await Warehouse.findById(fromWarehouse).session(
    session
  );
  const targetWarehouse = await Warehouse.findById(toWarehouse).session(
    session
  );
  if (!sourceWarehouse || !targetWarehouse)
    throw { status: 404, msg: "Warehouse not found" };

  // Validate bins inside warehouses
  if (
    !sourceWarehouse.bins.some((b) => b._id.toString() === fromBin.toString())
  )
    throw { status: 400, msg: "Source bin not found in source warehouse" };

  if (!targetWarehouse.bins.some((b) => b._id.toString() === toBin.toString()))
    throw { status: 400, msg: "Target bin not found in target warehouse" };

  // Deduct from source
  const sourceStock = await Stock.findOne({
    product,
    warehouse: fromWarehouse,
    bin: fromBin,
  }).session(session);
  if (!sourceStock || sourceStock.quantity < quantity)
    throw { status: 400, msg: "Not enough stock in source bin" };

  sourceStock.quantity -= quantity;
  await sourceStock.save({ session });

  // Add to target
  let targetStock = await Stock.findOne({
    product,
    warehouse: toWarehouse,
    bin: toBin,
  }).session(session);
  if (targetStock) {
    targetStock.quantity += quantity;
    await targetStock.save({ session });
  } else {
    targetStock = await Stock.create(
      [{ product, warehouse: toWarehouse, bin: toBin, quantity }],
      { session }
    );
    targetStock = targetStock[0];
  }

  const finalAmount = taxableAmount + (taxableAmount * (taxPercent || 0)) / 100;

  const exchangeDoc = await StockExchange.create(
    [
      {
        product,
        fromWarehouse,
        toWarehouse,
        fromBin,
        toBin,
        quantity,
        taxableAmount,
        taxPercent,
        finalAmount,
        transferNo: transferNo || generateTransferNo(),
        status: "completed",
      },
    ],
    { session }
  );

  return exchangeDoc[0];
};

// Create (or request) endpoint
export const createStockExchange = async (req, res) => {
  const {
    product,
    fromWarehouse,
    toWarehouse,
    fromBin,
    toBin,
    quantity,
    taxableAmount,
    taxPercent,
    transferNo,
    type,
  } = req.body;

  try {
    // Admin: immediate transfer (performTransfer)
    if (
      req.user.role === "admin" ||
      (req.user.permissions &&
        req.user.permissions.includes(
          type === "warehouse" ? "transfer-warehouse" : "transfer-bin"
        ))
    ) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const exchange = await performTransfer(
          {
            product,
            fromWarehouse,
            toWarehouse,
            fromBin,
            toBin,
            quantity,
            taxableAmount,
            taxPercent,
            transferNo,
          },
          session
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: "Stock transferred", exchange });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    }

    // Non-admin without permission => create pending request
    const pending = await StockExchange.create({
      product,
      fromWarehouse,
      toWarehouse,
      fromBin,
      toBin,
      quantity,
      taxableAmount,
      taxPercent,
      finalAmount: taxableAmount + (taxableAmount * (taxPercent || 0)) / 100,
      transferNo: transferNo || generateTransferNo(),
      status: "pending",
      requestedBy: req.user._id,
      requestedAt: new Date(),
    });

    return res
      .status(201)
      .json({ message: "Transfer request created", exchange: pending });
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return res.status(status).json({ msg: err.msg || "Server error" });
  }
};

// Admin: get pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const pending = await StockExchange.find({ status: "pending" })
      .populate("product", "itemName")
      .populate("fromWarehouse", "name bins")
      .populate("toWarehouse", "name bins")
      .populate("requestedBy", "name email")
      .sort({ createdAt: -1 });

    // add bin names
    const formatted = pending.map((ex) => {
      const fromBinObj = ex.fromWarehouse?.bins.find(
        (b) => b._id.toString() === ex.fromBin.toString()
      );
      const toBinObj = ex.toWarehouse?.bins.find(
        (b) => b._id.toString() === ex.toBin.toString()
      );
      return {
        ...ex.toObject(),
        fromBinName: fromBinObj?.name,
        toBinName: toBinObj?.name,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin approve

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await StockExchange.findById(id).populate(
      "product fromWarehouse toWarehouse"
    );
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // 1️⃣ Find stock in FROM warehouse & bin
    const fromStock = await Stock.findOne({
      warehouse: request.fromWarehouse._id,
      product: request.product._id,
      bin: request.fromBin, // assuming you stored bin id in request
    });

    if (!fromStock || fromStock.quantity < request.quantity) {
      return res.status(400).json({ msg: "Insufficient stock in source bin" });
    }

    // 2️⃣ Deduct from source
    fromStock.quantity -= request.quantity;
    await fromStock.save();

    // 3️⃣ Add to target warehouse/bin
    let toStock = await Stock.findOne({
      warehouse: request.toWarehouse._id,
      product: request.product._id,
      bin: request.toBin,
    });

    if (!toStock) {
      toStock = new Stock({
        warehouse: request.toWarehouse._id,
        product: request.product._id,
        bin: request.toBin,
        quantity: 0,
      });
    }
    toStock.quantity += request.quantity;
    await toStock.save();

    // 4️⃣ Mark transfer as approved
    request.status = "approved";
    await request.save();

    res.json({ msg: "Transfer approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Server error while approving transfer",
      error: error.message,
    });
  }
};

// Admin reject
export const rejectRequest = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Unauthorized" });

    const request = await StockExchange.findById(id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    if (request.status !== "pending")
      return res.status(400).json({ msg: "Request is not pending" });

    request.status = "rejected";
    request.rejectReason = reason || "Rejected by admin";
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    await request.save();

    return res.status(200).json({ msg: "Request rejected", request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all exchanges (optionally filter by status)
export const getAllExchanges = async (req, res) => {
  try {
    const { status } = req.query; // ?status=pending or completed
    const filter = {};
    if (status) filter.status = status;
    const exchanges = await StockExchange.find(filter)
      .populate("product", "itemName")
      .populate("fromWarehouse", "name bins")
      .populate("toWarehouse", "name bins")
      .populate("requestedBy", "name")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    // add bin names
    const formatted = exchanges.map((ex) => {
      const fromBinObj = ex.fromWarehouse?.bins.find(
        (b) => b._id.toString() === ex.fromBin.toString()
      );
      const toBinObj = ex.toWarehouse?.bins.find(
        (b) => b._id.toString() === ex.toBin.toString()
      );
      return {
        ...ex.toObject(),
        fromBinName: fromBinObj?.name,
        toBinName: toBinObj?.name,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get single exchange
export const getExchangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const exchange = await StockExchange.findById(id)
      .populate("product", "itemName")
      .populate("fromWarehouse", "name bins")
      .populate("toWarehouse", "name bins")
      .populate("requestedBy", "name")
      .populate("approvedBy", "name");

    if (!exchange) return res.status(404).json({ msg: "Not found" });
    const fromBinObj = exchange.fromWarehouse?.bins.find(
      (b) => b._id.toString() === exchange.fromBin.toString()
    );
    const toBinObj = exchange.toWarehouse?.bins.find(
      (b) => b._id.toString() === exchange.toBin.toString()
    );
    return res.status(200).json({
      ...exchange.toObject(),
      fromBinName: fromBinObj?.name,
      toBinName: toBinObj?.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
