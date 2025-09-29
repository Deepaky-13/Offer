import Product from "../models/Product.js";
import bwipjs from "bwip-js";
import cloudinary from "../Config/Cloudinary.js";
// assume configured cloudinary
import XLSX from "xlsx";

/**
 * Generate barcode buffer
 */
const generateBarcode = async (text) => {
  return await bwipjs.toBuffer({
    bcid: "code128",
    text: text,
    scale: 3,
    height: 10,
    includetext: false,
  });
};

/**
 * Upload barcode to Cloudinary
 */
const uploadBarcode = async (buffer, name) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "barcodes", public_id: name, overwrite: true },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Create a single product (with barcodes)
 */
const createProductWithBarcode = async ({ srNo, mdNo, ...rest }) => {
  if (!srNo && !mdNo) {
    throw new Error("Serial Number or Model Number is required");
  }

  let srNoBarcodeUrl = null;
  let mdNoBarcodeUrl = null;

  if (srNo) {
    const srBuffer = await generateBarcode(srNo);
    srNoBarcodeUrl = await uploadBarcode(srBuffer, `srNo_${srNo}`);
  }

  if (mdNo) {
    const mdBuffer = await generateBarcode(mdNo);
    mdNoBarcodeUrl = await uploadBarcode(mdBuffer, `mdNo_${mdNo}`);
  }

  return await Product.create({
    srNo,
    mdNo,
    srNoBarcodeUrl,
    mdNoBarcodeUrl,
    ...rest,
  });
};

/**
 * Controller
 */
export const createProduct = async (req, res) => {
  try {
    // 📂 Case 1: File upload (Excel)
    if (req.file) {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const products = [];
      for (const row of data) {
        try {
          const product = await createProductWithBarcode(row);
          products.push(product);
        } catch (err) {
          console.warn(`Skipping row due to error: ${err.message}`);
        }
      }

      return res.status(201).json({
        msg: "Products uploaded successfully",
        count: products.length,
      });
    }

    // 📝 Case 2: Single product form
    const product = await createProductWithBarcode(req.body);
    return res.status(201).json({ msg: "Product created", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({ count: products.length, products });
};

// Get single product
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }
  res.status(200).json(product);
};

// Update product
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }
  res.status(200).json({ msg: "Product updated", product });
};

// Delete product
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }
  res.status(200).json({ msg: "Product deleted" });
};

export const getBarCode = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Send barcode URLs along with other product info
    res.status(200).json({
      srNoBarcodeUrl: product.srNoBarcodeUrl,
      mdNoBarcodeUrl: product.mdNoBarcodeUrl,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
