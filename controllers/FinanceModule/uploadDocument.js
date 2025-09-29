import cloudinary from "../../Config/Cloudinary.js";
import Document from "../../models/FinanceModule/Document.js";

export const uploadDocument = async (req, res) => {
  try {
    const { customerId } = req.body; // 👈 take customerId from frontend
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }

    const uploadedFiles = {};

    for (const key in req.files) {
      const file = req.files[key][0];

      // Upload to Cloudinary
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "documents" },
          (error, result) => {
            if (error) reject(error);
            else {
              uploadedFiles[key] = result.secure_url;
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });
    }

    // Save into MongoDB with customerId
    const newDoc = new Document({
      customerId, // 👈 attach customerId here
      ...uploadedFiles,
    });
    await newDoc.save();

    res.json({ message: "Files uploaded successfully", data: newDoc });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch documents by customerId
export const getDocuments = async (req, res) => {
  try {
    const { customerId } = req.params;
    const docs = await Document.find({ customerId }).sort({ createdAt: -1 }); // 👈 use createdAt from timestamps
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};
