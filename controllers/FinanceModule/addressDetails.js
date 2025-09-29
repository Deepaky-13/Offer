import AddressDetails from "../../models/FinanceModule/AddressDetails.js";

export const addressDetails = async (req, res) => {
  const {
    customerId,
    poaType,
    poaNo,
    poaExpiry,
    changeAddress,
    residenceType,
    zip,
    bflBranch,
    customerAddress,
    addressLine1,
    addressLine2,
    addressLine3,
    area,
    landmark,
    city,
    state,
  } = req.body;

   if (!customerId) {
      return res.status(400).json({ msg: "customerId is required" });
    }

  const newAddressDetails = await AddressDetails.create({
    customerId,
    poaType,
    poaNo,
    poaExpiry,
    changeAddress,
    residenceType,
    zip,
    bflBranch,
    customerAddress,
    addressLine1,
    addressLine2,
    addressLine3,
    area,
    landmark,
    city,
    state,
  });
  res
    .status(201)
    .json({ msg: "Address details added successfully", newAddressDetails });
};

export const getAddressDetailController = async (req, res) =>{
  try{
    const response =await AddressDetails.find();
    return res.status(200).json({ response});
  }catch(error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}