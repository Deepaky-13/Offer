import AssetDetails from "../../models/FinanceModule/AssetDetails.js";
import SchemeModel from "../../models/FinanceModule/SchemeModel.js";

// Helper to calculate EMI schedule and amounts
const calculateAssetValues = (
  scheme,
  loanAmount,
  userDownPayment = 0,
  paymentDay = 1
) => {
  if (!scheme || !scheme.grossAdvTenor) {
    throw new Error("Scheme data missing or invalid");
  }

  // Parse tenor and downPaymentMonths from scheme
  const [tenorMonths, downPaymentMonths] = scheme.grossAdvTenor
    .split("/")
    .map(Number);

  // Total loan and down payment
  const totalLoan = parseFloat(loanAmount);
  const downPayment = downPaymentMonths
    ? (totalLoan / tenorMonths) * downPaymentMonths
    : userDownPayment;

  const principal = totalLoan - downPayment;

  // EMI calculation
  const R = parseFloat(scheme.roi) / 100 / 12; // monthly interest rate
  const N = tenorMonths;

  let emi = 0;
  if (R > 0) {
    emi = (principal * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  } else {
    emi = principal / N;
  }

  const processingFee = (principal * (scheme.processingFeePercent || 0)) / 100;
  const dbd = (principal * (scheme.dbdPercent || 0)) / 100;

  // EMI dates based on user payment day
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), paymentDay);
  const emiDates = [];
  for (let i = 0; i < N; i++) {
    const date = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + i,
      startDate.getDate()
    );
    emiDates.push(date);
  }

  return {
    emi: Math.round(emi),
    processingFee: Math.round(processingFee),
    dbd: Math.round(dbd),
    downPayment: Math.round(downPayment),
    emiDates,
    dbdString: `₹${Math.round(dbd)} / ${scheme.dbdPercent || 0}%`,
  };
};

// Create asset detail
export const createAsset = async (req, res) => {
  try {
    const {
      customerId,
      product,
      invoiceAmount,
      loanAmount,
      combo,
      paymentDay,
      schemeId,
    } = req.body;

    if (!schemeId || !customerId)
      return res.status(400).json({ msg: "Scheme must be selected" });

    // Fetch scheme from DB
    const scheme = await SchemeModel.findById(schemeId);
    if (!scheme) return res.status(404).json({ msg: "Scheme not found" });

    const values = calculateAssetValues(scheme, loanAmount, combo, paymentDay);

    // Initialize paidEMIs array with false for each EMI month
    const paidEMIs = values.emiDates.map(() => false);

    const asset = await AssetDetails.create({
      customerId,
      product,
      invoiceAmount,
      loanAmount,
      combo,
      paymentDay,
      scheme: scheme._id,
      emi: values.emi,
      processingFee: values.processingFee,
      dbd: values.dbd,
      downPayment: values.downPayment,
      emiDates: values.emiDates,
      paidEMIs, // 👈 added here
    });

    res.status(201).json({ msg: "Asset details saved successfully", asset });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ msg: "Failed to save asset details", error: err.message });
  }
};

// Get all assets
export const getAllAssets = async (req, res) => {
  try {
    const assets = await AssetDetails.find().populate("scheme");
    res.status(200).json({ assets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch assets" });
  }
};

// Get single asset
export const getAsset = async (req, res) => {
  try {
    const asset = await AssetDetails.findById(req.params.id).populate("scheme");
    if (!asset) return res.status(404).json({ msg: "Asset not found" });
    res.status(200).json({ asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch asset" });
  }
};

// Update asset
export const updateAsset = async (req, res) => {
  try {
    const asset = await AssetDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ msg: "Asset updated successfully", asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update asset" });
  }
};

// Delete asset
export const deleteAsset = async (req, res) => {
  try {
    await AssetDetails.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Asset deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete asset" });
  }
};
