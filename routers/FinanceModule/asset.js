import express from "express";
import {
  createAsset,
  getAllAssets,
  getAsset,
  updateAsset,
  deleteAsset,
  updateEMIPayment,
} from "../../controllers/FinanceModule/assetsProperty.js";
import AssetDetails from "../../models/FinanceModule/AssetDetails.js";

const router = express.Router();

// Asset CRUD
router.post("/", createAsset); // Create asset with selected scheme
router.get("/", getAllAssets); // Get all assets
router.get("/:id", getAsset); // Get single asset
router.put("/:id", updateAsset); // Update asset
router.delete("/:id", deleteAsset); // Delete asset
router.patch("/updateEmi/:id", updateEMIPayment);
// PATCH /assetDetails/:id/payEmi/:index
// PATCH /assetDetails/:id/payEmi/:index
router.patch("/:id/payEmi/:index", async (req, res) => {
  const { id, index } = req.params;

  try {
    const asset = await AssetDetails.findById(id);
    if (!asset) return res.status(404).json({ msg: "Asset not found" });

    // Convert index to number
    const emiIndex = parseInt(index, 10);

    // Initialize paidEMIs if it doesn't exist or length mismatch
    if (!asset.paidEMIs || asset.paidEMIs.length !== asset.emiDates.length) {
      asset.paidEMIs = Array(asset.emiDates.length).fill(false);
    }

    // Check if index is valid
    if (emiIndex >= 0 && emiIndex < asset.paidEMIs.length) {
      asset.paidEMIs[emiIndex] = true; // mark as paid
      await asset.save();
      return res.json({ msg: "EMI updated successfully", asset });
    } else {
      return res.status(400).json({ msg: "Invalid EMI index" });
    }
  } catch (err) {
    console.error("Error updating EMI:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
