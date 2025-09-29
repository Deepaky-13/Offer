import AdditionalInfo from "../../models/FinanceModule/AdditionalInfo.js";
import FreshCustomer from "../../models/FinanceModule/FreshCustomer.js";

export const createAdditionalDetails = async (req, res) => {
  try {
    const {
      customerId,
      fatherName,
      motherName,
      altNo,
      language,
      communicateLang,
      maritalStatus,
      qualification,
      mailingAddress,
    } = req.body;

     if (!customerId) {
      return res.status(400).json({ msg: "customerId is required" });
    }

    // Check if altNo already exists in FreshCustomer.mobileNo
    const exist = await FreshCustomer.findOne({ mobileNo: altNo });
    if (exist) {
      return res.status(400).json({ msg: "Use a different alternate number" });
    }

    // Save new AdditionalInfo
    const additionalInfo = await AdditionalInfo.create({
      customerId,
      fatherName,
      motherName,
      altNo,
      language,
      communicateLang,
      maritalStatus,
      qualification,
      mailingAddress,
    });

    res.status(201).json({
      msg: "Additional Information added successfully",
      additionalInfo,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getAdditionalDetailsController = async (req,res) => {
       try {
    const details = await AdditionalInfo.find(); // fetch all documents
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}
