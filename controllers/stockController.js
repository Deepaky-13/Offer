import Stock from "../models/Stock.js";
import StockExchange from "../models/StockExchange.js";

// ✅ Add stock into a specific bin
export const addStock = async (req, res) => {
  const { product, warehouse, bin, quantity } = req.body;

  let stock = await Stock.findOne({
    product: product,
    warehouse: warehouse,
    bin: bin,
  });

  if (stock) {
    stock.quantity += quantity;
    await stock.save();
  } else {
    stock = await Stock.create({
      product: product,
      warehouse: warehouse,
      bin: bin,
      quantity,
    });
  }

  res.status(201).json({ msg: "Stock added successfully", stock });
};

// ✅ Get all stock (optionally filter by warehouse or product)
// export const getStocks = async (req, res) => {
//   const { warehouseId, productId } = req.query;

//   let filter = {};
//   if (warehouseId) filter.warehouse = warehouseId;
//   if (productId) filter.product = productId;

//   const stocks = await Stock.find(filter)
//     .populate("product", "itemName")
//     .populate("warehouse", "name")
//     .populate("bin", "name");

//   res.json({ count: stocks.length, stocks });
// };

export const getStocks = async (req, res) => {
  const { warehouseId, productId } = req.query;

  let filter = {};
  if (warehouseId) filter.warehouse = warehouseId;
  if (productId) filter.product = productId;

  const stocks = await Stock.find(filter)
    .populate("product", "itemName")
    .populate("warehouse", "name bins"); // include bins array

  // Map the stocks to include bin name
  const formattedStocks = stocks.map((s) => {
    const binData = s.warehouse?.bins?.id(s.bin); // find subdocument by _id
    return {
      _id: s._id,
      product: s.product,
      warehouse: { _id: s.warehouse?._id, name: s.warehouse?.name },
      bin: binData ? { _id: binData._id, name: binData.name } : null,
      quantity: s.quantity,
    };
  });

  res.json({ count: formattedStocks.length, stocks: formattedStocks });
};

// ✅ Transfer stock from one bin to another
export const transferStock = async (req, res) => {
  const {
    productId,
    fromBinId,
    toBinId,
    fromWarehouseId,
    toWarehouseId,
    quantity,
  } = req.body;

  // Check stock in source bin
  const sourceStock = await Stock.findOne({
    product: productId,
    warehouse: fromWarehouseId,
    bin: fromBinId,
  });

  if (!sourceStock || sourceStock.quantity < quantity) {
    return res.status(400).json({ msg: "Not enough stock in source bin" });
  }

  // Deduct from source
  sourceStock.quantity -= quantity;
  await sourceStock.save();

  // Add to destination
  let destStock = await Stock.findOne({
    product: productId,
    warehouse: toWarehouseId,
    bin: toBinId,
  });

  if (destStock) {
    destStock.quantity += quantity;
    await destStock.save();
  } else {
    destStock = await Stock.create({
      product: productId,
      warehouse: toWarehouseId,
      bin: toBinId,
      quantity,
    });
  }

  // Record Stock Exchange transaction
  const exchange = await StockExchange.create({
    product: productId,
    fromWarehouse: fromWarehouseId,
    toWarehouse: toWarehouseId,
    fromBin: fromBinId,
    toBin: toBinId,
    quantity,
  });

  res.json({ msg: "Stock transferred successfully", exchange });
};

// 📌 Stock summary (current qty)
export const getStockSummary = async (req, res) => {
  try {
    const stock = await Stock.find()
      .populate("product", "sku itemName capacity category")
      .populate("warehouse", "name")
      .lean();

    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
