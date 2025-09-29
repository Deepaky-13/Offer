import createZip from "../../models/FinanceModule/createZip.js";
import AdditionalInfo from "../../models/FinanceModule/AdditionalInfo.js"
import AddressDetails from "../../models/FinanceModule/AddressDetails.js"
import AssetDetails from "../../models/FinanceModule/AssetDetails.js"
import Document from "../../models/FinanceModule/Document.js";
import OfficeInfo from "../../models/FinanceModule/OfficeInfo.js";
import bankDetailsModule from "../../models/FinanceModule/bankDetailsModule.js"
import userDetails from "../../models/FinanceModule/userDetails.js";

export const zipVerify = async (req, res) => {
  try {
    const { zip, bflBranch, poaAddress } = req.body;

    const saveddata = await createZip.create({ zip, bflBranch, poaAddress });

    res.status(201).json({
      msg: "Zip details saved successfully",
      customerId: saveddata.customerId,  // 👈 important
      saveddata,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getZipController = async (req, res) =>{
  try{
     const { customerId } = req.params;
     const customer = await createZip.findOne({ customerId});
      if (!customer) return res.status(404).json({ msg: "Customer not found" });

        const [
      additionalInfo,
      addressDetails,
      assetDetails,
      officeInfo,
      documents,
      userDetail,
      bankDetail,
    ] = await Promise.all([
      AdditionalInfo.findOne({ customerId }),
      AddressDetails.findOne({ customerId }),
      AssetDetails.findOne({ customerId }),
      OfficeInfo.findOne({ customerId }),
      Document.findOne({ customerId }),
      userDetails.findOne({ customerId }),
      bankDetailsModule.findOne({ customerId}),
    ]);
    res.status(200).json({
      customer,
      additionalInfo,
      addressDetails,
      assetDetails,
      officeInfo,
      documents,
      userDetail,
      bankDetail
    });
  } catch(error){
    return res.status(500).json({ error: error.msg});
  }
}
