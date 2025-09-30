// import AssetDetails from "../../models/FinanceModule/AssetDetails.js";
// import SchemeModel from "../../models/FinanceModule/SchemeModel.js";

// // Helper to calculate EMI schedule and amounts
// const calculateAssetValues = (
//   scheme,
//   loanAmount,
//   userDownPayment = 0,
//   paymentDay = 1
// ) => {
//   if (!scheme || !scheme.grossAdvTenor) {
//     throw new Error("Scheme data missing or invalid");
//   }

//   // Parse tenor and downPaymentMonths from scheme
//   const [tenorMonths, downPaymentMonths] = scheme.grossAdvTenor
//     .split("/")
//     .map(Number);

//   // Total loan and down payment
//   const totalLoan = parseFloat(loanAmount);
//   const downPayment = downPaymentMonths
//     ? (totalLoan / tenorMonths) * downPaymentMonths
//     : userDownPayment;

//   const principal = totalLoan - downPayment;

//   // EMI calculation
//   const R = parseFloat(scheme.roi) / 100 / 12; // monthly interest rate
//   const N = tenorMonths;

//   let emi = 0;
//   if (R > 0) {
//     emi = (principal * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
//   } else {
//     emi = principal / N;
//   }

//   // EMI dates based on user payment day
//   const today = new Date();
//   const startDate = new Date(today.getFullYear(), today.getMonth(), paymentDay);
//   const emiDates = [];
//   for (let i = 0; i < N; i++) {
//     const date = new Date(
//       startDate.getFullYear(),
//       startDate.getMonth() + i,
//       startDate.getDate()
//     );
//     emiDates.push(date);
//   }

//   return {
//     emi: Math.round(emi),
//     downPayment: Math.round(downPayment),
//     emiDates,
//   };
// };

// // Create asset detail
// export const createAsset = async (req, res) => {
//   try {
//     const {
//       customerId,
//       product,
//       invoiceAmount,
//       loanAmount,
//       combo,
//       paymentDay,
//       schemeId,
//       processingFee = 0, // directly from user input
//       dbd = 0, // directly from user input
//     } = req.body;

//     if (!schemeId || !customerId)
//       return res.status(400).json({ msg: "Scheme must be selected" });

//     // Fetch scheme from DB
//     const scheme = await SchemeModel.findById(schemeId);
//     if (!scheme) return res.status(404).json({ msg: "Scheme not found" });

//     const values = calculateAssetValues(scheme, loanAmount, combo, paymentDay);

//     // Initialize paidEMIs array with false for each EMI month
//     const paidEMIs = values.emiDates.map(() => false);

//     const asset = await AssetDetails.create({
//       customerId,
//       product,
//       invoiceAmount,
//       loanAmount,
//       combo,
//       paymentDay,
//       scheme: scheme._id,
//       emi: values.emi,
//       processingFee: parseFloat(processingFee),
//       dbd: parseFloat(dbd),
//       downPayment: values.downPayment,
//       emiDates: values.emiDates,
//       paidEMIs, // 👈 added here
//     });

//     res.status(201).json({ msg: "Asset details saved successfully", asset });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ msg: "Failed to save asset details", error: err.message });
//   }
// };

// // Get all assets
// export const getAllAssets = async (req, res) => {
//   try {
//     const assets = await AssetDetails.find().populate("scheme");
//     res.status(200).json({ assets });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to fetch assets" });
//   }
// };

// // Get single asset
// export const getAsset = async (req, res) => {
//   try {
//     const asset = await AssetDetails.findById(req.params.id).populate("scheme");
//     if (!asset) return res.status(404).json({ msg: "Asset not found" });
//     res.status(200).json({ asset });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to fetch asset" });
//   }
// };

// // Update asset
// export const updateAsset = async (req, res) => {
//   try {
//     const asset = await AssetDetails.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json({ msg: "Asset updated successfully", asset });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to update asset" });
//   }
// };

// // Delete asset
// export const deleteAsset = async (req, res) => {
//   try {
//     await AssetDetails.findByIdAndDelete(req.params.id);
//     res.status(200).json({ msg: "Asset deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Failed to delete asset" });
//   }
// };

// controllers/AssetController.js
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
    downPayment: Math.round(downPayment),
    emiDates,
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
      processingFee = 0,
      dbd = 0,
    } = req.body;

    if (!schemeId || !customerId)
      return res.status(400).json({ msg: "Scheme must be selected" });

    // Fetch scheme from DB
    const scheme = await SchemeModel.findById(schemeId);
    if (!scheme) return res.status(404).json({ msg: "Scheme not found" });

    const values = calculateAssetValues(scheme, loanAmount, combo, paymentDay);

    // Initialize paidEMIs array with objects
    const paidEMIs = values.emiDates.map((date) => ({
      amount: values.emi,
      paid: false,
      paymentDate: null,
      paymentMode: "Cash", // default
      latePayment: false,
    }));

    const asset = await AssetDetails.create({
      customerId,
      product,
      invoiceAmount,
      loanAmount,
      combo,
      paymentDay,
      scheme: scheme._id,
      emi: values.emi,
      processingFee: parseFloat(processingFee),
      dbd: parseFloat(dbd),
      downPayment: values.downPayment,
      emiDates: values.emiDates,
      paidEMIs,
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

// Update asset (general updates)
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

// Update individual EMI payment

export const updateEMIPayment = async (req, res) => {
  try {
    const {
      assetId,
      monthIndex,
      paid,
      paymentMode,
      paymentDate,
      latePayment,
      lateFine,
    } = req.body;

    // Find the asset
    const asset = await AssetDetails.findById(assetId);
    if (!asset) return res.status(404).json({ msg: "Asset not found" });

    // Ensure paidEMIs array exists
    if (!asset.paidEMIs || !Array.isArray(asset.paidEMIs))
      return res.status(400).json({ msg: "No EMI schedule found" });

    // Auto-fill missing amounts for all EMIs
    asset.paidEMIs = asset.paidEMIs.map((emi) => ({
      amount: emi.amount != null ? emi.amount : asset.emi, // fill if missing
      paid: emi.paid != null ? emi.paid : false,
      paymentMode: emi.paymentMode || "Cash",
      paymentDate: emi.paymentDate || null,
      latePayment: emi.latePayment || false,
      lateFine: emi.lateFine || 0,
    }));

    // Validate month index
    if (!asset.paidEMIs[monthIndex])
      return res.status(400).json({ msg: "Invalid month index" });

    // Update only the current EMI
    const currentEMI = asset.paidEMIs[monthIndex];
    currentEMI.amount = asset.emi; // backend controlled
    currentEMI.paid = paid;
    currentEMI.paymentMode = paymentMode || currentEMI.paymentMode;
    currentEMI.paymentDate = paymentDate || new Date();
    currentEMI.latePayment = latePayment || false;
    currentEMI.lateFine = lateFine || currentEMI.lateFine;

    // Save the asset
    await asset.save();

    res.status(200).json({ msg: "EMI updated successfully", asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update EMI", error: err.message });
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
