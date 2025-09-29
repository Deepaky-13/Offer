import bankDetailsModule from "../../models/FinanceModule/bankDetailsModule.js";

export const createBankDetails = async (req, res) => {
    try{
    const {customerId,spouseName, familyMember, bankName, branchName, accountNo, ifscCode} = req.body;

    if(!customerId){
        return res.status(400).json("customerId is required");
    }

    if(!spouseName || !familyMember || !bankName || !branchName || !accountNo || !ifscCode){
        return res.status(400).json("all field are required");
    }

    const details= await bankDetailsModule.create({
        customerId,spouseName, familyMember, bankName, branchName, accountNo, ifscCode
    });

    return res.status(200).json({ msg: "Details submitted successFully", details});

}catch(error){
    return res.status(400).json({error: error.msg});
}


}