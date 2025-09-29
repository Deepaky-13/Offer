import OfficeInfo from "../../models/FinanceModule/OfficeInfo.js";

export const officeInfo = async (req, res) => {
  const {
    customerId,
    companyName,
    extraCompany,
    companyNature,
    otherNature,
    designation,
    income,
    officePhoneNoType,
    officePhoneNo,
    officePinCode,
    officeAddressLine1,
    officeAddressLine2,
    officeAddressLine3,
    officeArea,
    officeCity,
    officeState,
  } = req.body;

   if (!customerId) {
      return res.status(400).json({ msg: "customerId is required" });
    }

  const Office = await OfficeInfo.create({
    customerId,
    companyName,
    extraCompany,
    companyNature,
    otherNature,
    designation,
    income,
    officePhoneNoType,
    officePhoneNo,
    officePinCode,
    officeAddressLine1,
    officeAddressLine2,
    officeAddressLine3,
    officeArea,
    officeCity,
    officeState,
    status: "pending"
  });

  const digit = Math.floor(100000 + Math.random() * 900000);

  const updatedOffice = await OfficeInfo.findByIdAndUpdate(
  Office._id,
  { loanNo: digit },
  { new: true }
);

  res.status(201).json({ msg: "Office details stored successfully", Office: updatedOffice });
};

export const getOfficeDetailsController = async (req, res) => {
   try{
     const details=await OfficeInfo.find();
    return res.status(200).json(details);
   }catch(error){
    return res.status(500).json({msg: "server error", error: error.msg})
   }
}

export const getStatus= async (req, res) => {
  try {
    const loans = await OfficeInfo.find({ status: "Pending" });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch requests" });
  }
};

export const getStatusResult=  async (req, res) => {
  try {
    const { status } = req.body; // "Approved" or "Rejected"
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ msg: `Loan ${status}`, loan: updatedLoan });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update status" });
  }
};