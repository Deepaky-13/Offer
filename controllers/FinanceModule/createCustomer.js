import NewCustomer from "../../models/FinanceModule/FreshCustomer.js";

export const createCustomer = async (req, res) => {
  const { customerType, mobileNo, cardNo } = req.body;

  const exist = await NewCustomer.findOne({ mobileNo });
  if (exist) {
    return res
      .status(400)
      .json({ msg: "the mobile number is already registered" });
  }

  const newCustomer = await NewCustomer.create({
    customerType,
    mobileNo,
    cardNo,
  });
  res.status(201).json({ msg: "Customer created successfully", newCustomer });
};

export const getCustomerDetailsController = async(req,res) =>{
  try{
    const details=await NewCustomer.find();
    return res.status(200).json(details);
  }catch(error){
    return res.status(500).json({msg: "Server error" , error: error.msg})
  }
}
