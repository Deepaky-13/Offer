import userDetails from "../../models/FinanceModule/userDetails.js";

export const createUserDetails = async (req, res) => {
  const {
    customerId,
    income,
    poiDetails,
    poiNumber,
    expiry,
    fName,
    mName,
    lName,
    gender,
    dob,
    employeeType,
    panAvailable,
    panNo,
    nameOnPan,
    alterNameOnPan,
    zip,
  } = req.body;

   if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }

  const storeData = await userDetails.create({
    customerId,
    income,
    poiDetails,
    poiNumber,
    expiry,
    fName,
    mName,
    lName,
    gender,
    dob,
    employeeType,
    panAvailable,
    panNo,
    nameOnPan,
    alterNameOnPan,
    zip,
  });

  res.status(201).json({ msg: "User details stored successfully", storeData });
};


export const getUserDetailsController = async (req,res) => {
    try{
      const details = await userDetails.find();
      return res.status(200).json(details);
    }catch(error){
      return res.status(500).json({msg : "Status bar", error: error.msg})
    }
}