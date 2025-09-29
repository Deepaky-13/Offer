// import Product from "../models/Product.js";
// import Stock from "../models/Stock.js";
// import StockInward from "../models/stockInwardSchema.js";
// import Warehouse from "../models/Warehouse.js";

// export const createStockInward = async (req, res) => {
//   try {
//     const {
//       billNo,
//       vendorName,
//       vendorLocation,
//       product,
//       SrNo,
//       warehouse,
//       bin,
//       quantity,
//       taxPercent,
//       createdBy,
//     } = req.body;

//     // Prevent duplicate billNo
//     const existing = await StockInward.findOne({ billNo });
//     if (existing) {
//       return res.status(400).json({ msg: "Bill No already exists" });
//     }

//     const generatedLot = SrNo || "LOT-" + Date.now();
//     const incomingQty = Number(quantity);

//     // ✅ Fetch product rate
//     const productData = await Product.findById(product).lean();
//     if (!productData) {
//       return res.status(404).json({ msg: "Product not found" });
//     }

//     const rate = Number(productData.rate) || 0;
//     const taxableAmount = rate * incomingQty;
//     const finalAmount =
//       taxableAmount + (taxableAmount * Number(taxPercent || 0)) / 100;

//     // ✅ Check bin capacity
//     const stockInBin = await Stock.findOne({ product, warehouse, bin });
//     const currentQty = stockInBin ? stockInBin.quantity : 0;

//     const warehouseData = await Warehouse.findById(warehouse).lean();
//     const binData = warehouseData?.bins?.find((b) => b._id.toString() === bin);
//     if (!binData) {
//       return res
//         .status(400)
//         .json({ msg: "Selected bin not found in warehouse" });
//     }
//     if (currentQty + incomingQty > binData.capacity) {
//       return res.status(400).json({ msg: "Bin capacity exceeded" });
//     }

//     // ✅ Save inward with calculated values
//     const inward = await StockInward.create({
//       billNo,
//       vendorName,
//       vendorLocation,
//       product,
//       SrNo: generatedLot,
//       warehouse,
//       bin,
//       quantity: incomingQty,
//       taxPercent,
//       taxableAmount: taxableAmount.toFixed(2),
//       finalAmount: finalAmount.toFixed(2),
//       createdBy,
//     });

//     // ✅ Update stock
//     let stock = await Stock.findOne({ product, warehouse, bin });
//     if (stock) {
//       stock.quantity += incomingQty;
//       await stock.save();
//     } else {
//       stock = await Stock.create({
//         product,
//         warehouse,
//         bin,
//         quantity: incomingQty,
//       });
//     }

//     res.status(201).json({ msg: "Stock inward recorded", inward, stock });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get Inward Report
// export const getInwardReport = async (req, res) => {
//   try {
//     const records = await StockInward.find()
//       .populate("product", "sku itemName capacity category")
//       .populate("warehouse", "name bins")
//       .lean();

//     // add bin info
//     const formatted = records.map((r) => {
//       const binData = r.warehouse?.bins?.find(
//         (b) => b._id.toString() === r.bin?.toString()
//       );
//       return {
//         ...r,
//         bin: binData ? { _id: binData._id, name: binData.name } : null,
//       };
//     });

//     res.json(formatted).status(200);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// import Stock from "../models/Stock.js";
// import StockInward from "../models/stockInwardSchema.js";
// import Warehouse from "../models/Warehouse.js";
// // Create Stock Inward
// // export const createStockInward = async (req, res) => {
// //   try {
// //     const {
// //       billNo,
// //       vendorName,
// //       vendorLocation,
// //       product,
// //       SrNo,
// //       warehouse,
// //       bin,
// //       quantity,
// //       taxPercent,
// //       taxableAmount,
// //       finalAmount,
// //       createdBy,
// //     } = req.body;

// //     // ✅ Prevent duplicate billNo
// //     const existing = await StockInward.findOne({ billNo });
// //     if (existing) {
// //       return res.status(400).json({ msg: "Bill No already exists" });
// //     }

// //     // ✅ Auto lot number if missing
// //     const generatedLot = SrNo || "LOT-" + Date.now();

// //     // 1. Save transaction log
// //     const inward = await StockInward.create({
// //       billNo,
// //       vendorName,
// //       vendorLocation,
// //       product,
// //       SrNo: generatedLot,
// //       warehouse,
// //       bin,
// //       quantity,
// //       taxPercent,
// //       taxableAmount,
// //       finalAmount,
// //       createdBy,
// //     });

// //     // 2. Update stock balance
// //     let stock = await Stock.findOne({ product, warehouse, bin });
// //     if (stock) {
// //       stock.quantity += quantity;
// //       await stock.save();
// //     } else {
// //       stock = await Stock.create({ product, warehouse, bin, quantity });
// //     }

// //     res.status(201).json({ msg: "Stock inward recorded", inward, stock });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// export const createStockInward = async (req, res) => {
//   try {
//     const {
//       billNo,
//       vendorName,
//       vendorLocation,
//       product,
//       SrNo,
//       warehouse,
//       bin,
//       quantity,
//       taxPercent,
//       taxableAmount,
//       finalAmount,
//       createdBy,
//     } = req.body;

//     // Prevent duplicate billNo
//     const existing = await StockInward.findOne({ billNo });
//     if (existing) {
//       return res.status(400).json({ msg: "Bill No already exists" });
//     }

//     const generatedLot = SrNo || "LOT-" + Date.now();

//     // 1. Get the bin info to check capacity
//     const stockInBin = await Stock.findOne({ product, warehouse, bin });
//     const currentQty = stockInBin ? stockInBin.quantity : 0;
//     const incomingQty = Number(quantity);

//     // Fetch bin capacity from warehouse model
//     const warehouseData = await Warehouse.findById(warehouse).lean();
//     const binData = warehouseData?.bins?.find((b) => b._id.toString() === bin);
//     if (!binData) {
//       return res
//         .status(400)
//         .json({ msg: "Selected bin not found in warehouse" });
//     }

//     if (currentQty + incomingQty > binData.capacity) {
//       return res.status(400).json({ msg: "Bin capacity exceeded" });
//     }

//     // 2. Save transaction log
//     const inward = await StockInward.create({
//       billNo,
//       vendorName,
//       vendorLocation,
//       product,
//       SrNo: generatedLot,
//       warehouse,
//       bin,
//       quantity: incomingQty,
//       taxPercent,
//       taxableAmount,
//       finalAmount,
//       createdBy,
//     });

//     // 3. Update stock balance
//     let stock = await Stock.findOne({ product, warehouse, bin });
//     if (stock) {
//       stock.quantity += incomingQty; // increment stock
//       await stock.save();
//     } else {
//       stock = await Stock.create({
//         product,
//         warehouse,
//         bin,
//         quantity: incomingQty,
//       });
//     }

//     res.status(201).json({ msg: "Stock inward recorded", inward, stock });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get Inward Report
// export const getInwardReport = async (req, res) => {
//   try {
//     const records = await StockInward.find()
//       .populate("product", "sku itemName capacity category")
//       .populate("warehouse", "name bins")
//       .lean();

//     // add bin info
//     const formatted = records.map((r) => {
//       const binData = r.warehouse?.bins?.id(r.bin);
//       return {
//         ...r,
//         bin: binData ? { _id: binData._id, name: binData.name } : null,
//       };
//     });

//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import Stock from "../models/Stock.js";
import StockInward from "../models/stockInwardSchema.js";
import Warehouse from "../models/Warehouse.js";
import Product from "../models/Product.js";
// import Bin from "../models/Warehouse.js"
// Create Stock Inward
// export const createStockInward = async (req, res) => {
//   try {
//     const {
//       billNo,
//       vendorName,
//       vendorLocation,
//       product,
//       SrNo,
//       warehouse,
//       bin,
//       quantity,
//       taxPercent,
//       taxableAmount,
//       finalAmount,
//       createdBy,
//     } = req.body;

//     // ✅ Prevent duplicate billNo
//     const existing = await StockInward.findOne({ billNo });
//     if (existing) {
//       return res.status(400).json({ msg: "Bill No already exists" });
//     }

//     // ✅ Auto lot number if missing
//     const generatedLot = SrNo || "LOT-" + Date.now();

//     // 1. Save transaction log
//     const inward = await StockInward.create({
//       billNo,
//       vendorName,
//       vendorLocation,
//       product,
//       SrNo: generatedLot,
//       warehouse,
//       bin,
//       quantity,
//       taxPercent,
//       taxableAmount,
//       finalAmount,
//       createdBy,
//     });

//     // 2. Update stock balance
//     let stock = await Stock.findOne({ product, warehouse, bin });
//     if (stock) {
//       stock.quantity += quantity;
//       await stock.save();
//     } else {
//       stock = await Stock.create({ product, warehouse, bin, quantity });
//     }

//     res.status(201).json({ msg: "Stock inward recorded", inward, stock });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import ExcelJs from "exceljs";
import PDFDocument from "pdfkit";

import xlsx from "xlsx";

// Helper function to format numbers safely
const toNumber = (val) => (val ? Number(val) : 0);

export const createStockInward = async (req, res) => {
  try {
    // 🟢 Case 1: Frontend sends enriched JSON array
    if (Array.isArray(req.body)) {
      let insertedRecords = [];

      for (let row of req.body) {
        const {
          billNo,
          vendorName,
          vendorLocation,
          productId,
          srNo,
          warehouseId,
          binId,
          quantity,
          taxPercent,
          taxAmount,
          total,
          createdBy,
          inwardDate,
        } = row;

        // validate required fields
        if (!productId || !warehouseId || !binId || !quantity) {
          console.log(
            "Skipping row. Missing product/warehouse/bin/quantity:",
            row
          );
          continue;
        }

        // create stock inward
        const stockInward = new StockInward({
          billNo,
          vendorName,
          vendorLocation,
          product: productId,
          srNo,
          warehouse: warehouseId,
          bin: binId,
          quantity: Number(quantity),
          taxPercent: Number(taxPercent),
          taxableAmount: Number(taxAmount),
          finalAmount: Number(total),
          createdBy,
          inwardDate,
        });

        const saved = await stockInward.save();
        insertedRecords.push(saved);

        // update stock collection
        let stock = await Stock.findOne({
          product: productId,
          warehouse: warehouseId,
          bin: binId,
        });
        if (stock) {
          stock.quantity += Number(quantity);
          await stock.save();
        } else {
          stock = await Stock.create({
            product: productId,
            warehouse: warehouseId,
            bin: binId,
            quantity: Number(quantity),
          });
        }
      }

      return res.status(200).json({
        message: "Stock Inward uploaded successfully",
        insertedCount: insertedRecords.length,
        data: insertedRecords,
      });
    }

    // 📝 Case 2: Single form submission
    const {
      billNo,
      vendorName,
      vendorLocation,
      product,
      srNo,
      warehouse,
      bin,
      quantity,
      taxPercent,
      taxableAmount,
      finalAmount,
      createdBy,
    } = req.body;

    const existing = await StockInward.findOne({ billNo });
    if (existing)
      return res.status(400).json({ msg: "Bill No already exists" });

    const inward = await StockInward.create({
      billNo,
      vendorName,
      vendorLocation,
      product,
      srNo,
      warehouse,
      bin,
      quantity: toNumber(quantity),
      taxPercent: toNumber(taxPercent),
      taxableAmount: toNumber(taxableAmount),
      finalAmount: toNumber(finalAmount),
      createdBy,
    });

    // Update stock
    let stock = await Stock.findOne({ product, warehouse, bin });
    if (stock) {
      stock.quantity += toNumber(quantity);
      await stock.save();
    } else {
      stock = await Stock.create({
        product,
        warehouse,
        bin,
        quantity: toNumber(quantity),
      });
    }

    res.status(201).json({ msg: "Stock inward recorded", inward, stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get Inward Report
export const getInwardReport = async (req, res) => {
  try {
    const records = await StockInward.find()
      .populate("product", "sku itemName capacity category")
      .populate("warehouse", "name bins")
      .lean();

    // add bin info
    const formatted = records.map((r) => {
      const binData = r.warehouse?.bins?.find(
        (b) => b._id.toString() === r.bin?.toString()
      );
      return {
        ...r,
        bin: binData ? { _id: binData._id, name: binData.name } : null,
      };
    });

    res.json(formatted).status(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const formatInwardDocument = async (req, res) => {
  try {
    const { format } = req.params;

    // Fetch all inward data with populated references
    const data = await StockInward.find()
      .populate("product", "itemName sku")
      .populate("warehouse", "name")
      .lean();

    if (format === "excel") {
      const workbook = new ExcelJs.Workbook();
      const sheet = workbook.addWorksheet("Inward Data");

      // Define columns
      sheet.columns = [
        { header: "Bill No", key: "billNo" },
        { header: "Vendor Name", key: "vendorName" },
        { header: "Vendor Location", key: "vendorLocation" },
        { header: "Product", key: "product" },
        { header: "Sr No", key: "srNo" },
        { header: "Warehouse", key: "warehouse" },
        { header: "Bin", key: "bin" },
        { header: "Quantity", key: "quantity" },
        { header: "Tax Percent", key: "taxPercent" },
        { header: "Taxable Amount", key: "taxableAmount" },
        { header: "Final Amount", key: "finalAmount" },
        { header: "Created By", key: "createdBy" },
        { header: "Inward Date", key: "inwardDate" },
      ];

      // Add rows
      data.forEach((row) => {
        sheet.addRow({
          billNo: row.billNo,
          vendorName: row.vendorName,
          vendorLocation: row.vendorLocation || "-",
          product: row.product?.itemName || "",
          srNo: row.srNo,
          warehouse: row.warehouse?.name || "",
          bin: row.bin,
          quantity: row.quantity,
          taxPercent: row.taxPercent,
          taxableAmount: row.taxableAmount,
          finalAmount: row.finalAmount,
          createdBy: row.createdBy || "-",
          inwardDate: row.inwardDate,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=inward.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    } else if (format === "pdf") {
      try {
        const doc = new PDFDocument({ margin: 30, size: "A4" });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=inward.pdf");

        doc.pipe(res);
        doc.fontSize(18).text("Inward Stock Report", { align: "center" });
        doc.moveDown();

        data.forEach((row, index) => {
          doc.fontSize(12).text(`Record ${index + 1}`, { underline: true });
          doc.moveDown(0.3);

          doc.fontSize(10).text(`Bill No: ${row.billNo}`);
          doc.text(`Vendor Name: ${row.vendorName}`);
          doc.text(`Vendor Location: ${row.vendorLocation || "-"}`);
          doc.text(`Sr No: ${row.srNo}`);
          doc.text(`Quantity: ${row.quantity}`);
          doc.text(`Tax %: ${row.taxPercent}`);
          doc.text(`Taxable Amount: ${row.taxableAmount}`);
          doc.text(`Final Amount: ${row.finalAmount}`);
          doc.text(`Created By: ${row.createdBy || "-"}`);
          const formatDate = (date) =>
            date ? new Date(date).toLocaleString() : "-";
          doc.text(`Inward Date: ${formatDate(row.inwardDate)}`);

          doc.text(`Product: ${row.product?.itemName || row.product}`);
          doc.text(`Warehouse: ${row.warehouse?.name || row.warehouse}`);
          doc.text(`Bin: ${row.bin || "-"}`);

          doc.moveDown(1);
        });

        doc.end();
      } catch (pdfErr) {
        console.error("PDF Error:", pdfErr);
      }
    } else {
      res.status(400).json({ message: "Invalid format" });
    }
  } catch (err) {
    console.error("Export Inward Error:", err);
    res.status(500).json({ message: "Error exporting inward data" });
  }
};
