import cloudinary from "../../Config/Cloudinary.js";
import loanDetailsModel from "../../models/FinanceModule/loanDetailsModel.js";

export const createLoanDetails = async (req, res) => {
  try {
    const {
      loanNumber,
      customerName,
      productName,
      totalAmount,
      monthlyPaidAmount,
      remainingAmount,
      latePayment,
      geoLocation,
    } = req.body;

    let uploadedFiles = {};

    // Loop through uploaded files (invoice, shopDetails)
    for (const key of Object.keys(req.files)) {
      const file = req.files[key][0];
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "loan-documents" },
          (error, result) => {
            if (error) reject(error);
            else {
              uploadedFiles[key] = result.secure_url;
              resolve(result);
            }
          }
        );
        stream.end(file.buffer); // send file buffer to Cloudinary
      });
    }

    const loanDetail = new loanDetailsModel({
      loanNumber,
      customerName,
      productName,
      totalAmount,
      monthlyPaidAmount,
      remainingAmount,
      latePayment,
      geoLocation,

      invoice: uploadedFiles["invoice"] || null,
      shopDetails: uploadedFiles["shopDetails"] || null,
    });

    await loanDetail.save();
    res.status(201).json(loanDetail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getLoanDetails = async (req, res) => {
  try {
    const loans = await loanDetailsModel.find();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
